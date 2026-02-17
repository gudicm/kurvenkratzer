import express from 'express'
import {requireAuthentication} from '../middleware/authState.js'
import measurementStore from '../service/measurements.js'
import {sendToPrenudge} from '../service/prenudge.js'
import * as jose from "jose";
import userStore from "../service/users.js";

const router = express.Router()

/**
 * Routes that require authentication go here:
 * /home
 */

router.all('*', requireAuthentication)

router.get('/', async function (req, res, next) {
    res.locals.totalGlucose = await measurementStore.getSumByUser(req.user.id)
    res.locals.inBgRangeCtn = await measurementStore.getInBgRangeCtn(req.user.id)
    res.locals.outOfBgRangeCtn = await measurementStore.getOutOfBgRangeCtn(req.user.id)
    res.locals.preNudgeOkCtn = await measurementStore.getPreNudgeOkCtn(req.user.id)
    res.locals.preNudgeErrorCtn = await measurementStore.getPreNudgeErrorCtn(req.user.id)
    res.locals.avgGlucose = Math.trunc(res.locals.totalGlucose / (res.locals.inBgRangeCtn + res.locals.outOfBgRangeCtn))
    res.locals.balance = Math.trunc(res.locals.inBgRangeCtn - (res.locals.outOfBgRangeCtn * 2))
    res.locals.latestMeasurements = await measurementStore.findNewestByUser(req.user.id, 10)

    let subInfo = '';
    if (res.locals.hasPrenudge) {
        subInfo = ' (sub: ' + jose.decodeJwt(req.user.prenudgeCredentials.access_token).sub.slice(0, 4) + '...)';
    }

    // Prenudge-Info
    res.locals.prenudgeClass = res.locals.hasPrenudge ? 'alert-light' : 'alert-warning'
    res.locals.prenudgeText = res.locals.hasPrenudge ? '<strong>PreNudge</strong> ist eingerichtet. Wir übertragen deine Blutzucker-Daten automatisch'+ subInfo +'.' : 'Schon von <strong>PreNudge</strong> gehört? Übertrage deine Blutzucker-Daten jetzt in dein PreNudge-Profil: automatisch und kostenlos.'
    res.locals.prenudgeButton = res.locals.hasPrenudge ? 'PreNudge verwalten' : 'PreNudge einrichten'
    res.locals.prenudgeButtonClass = res.locals.hasPrenudge ? 'btn-outline-success' : 'btn-success'

    res.render('home')
})

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}

router.post('/measurement', async (req, res) => {
    const measurement = req.body.measurement
    if (measurement <= 0) {
        res.redirect('/')
        return
    }
    const savedMeasurement = await measurementStore.create({value: measurement,
        userId: req.user.id,
        targetBgLower: req.user.targetBgLower,
        targetBgUpper: req.user.targetBgUpper})
    res.redirect('/home')

    if (req.user.prenudgeCredentials) {
        await sleep(2000)
        sendToPrenudge(savedMeasurement).then(() => {
            console.log('Starting measurement sync.')
        }).catch((err) => {
            console.log(err)
        })
    }
})

router.post('/bgrange', async (req, res) => {

    const lower = parseInt(req.body.targetBgLower, 10)
    const upper = parseInt(req.body.targetBgUpper, 10)

    console.log('Save bg range [mg/dl]: lower=', lower, ' upper=', upper)

    if (lower <= 0 || upper <=0 || upper < lower) {
        console.log('Bg range validation failed!')
        res.redirect('/')
        return
    }
    await userStore.saveBgTargetRange(req.user.username, lower, upper);
    res.redirect('/home')
})

export default router