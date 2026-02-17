import express from 'express'
import {requireAuthentication} from '../middleware/authState.js'
import measurementStore from '../service/measurements.js'
import * as jose from "jose";

const router = express.Router()

/**
 * Routes that require authentication go here:
 * /api
 */

router.all('*', requireAuthentication)

router.get('/transactions', async function (req, res, next) {
    const measurements = await measurementStore.findNewestByUser(req.user.id, 10)

    let subject = ''
    if (req.user.prenudgeCredentials) {
        const jwt = req.user.prenudgeCredentials.access_token
        const decoded = jose.decodeJwt(jwt)
        subject = decoded.sub
    }

    const mappedMeasurements = measurements.map(item => {

        let lower = item.value && item.targetBgLower && item.value < item.targetBgLower;
        let upper = item.value && item.targetBgUpper && item.value > item.targetBgUpper;

        return ({
            ...item,
            isInRange: !lower && !upper,
            isLower: lower,
            isUpper: upper,
            outcomeOk: !item.status || (item.status < 300),
            fhirOutcomeJson: JSON.stringify(item.fhirOutcome, null, 2),
            isusersubject: !item.subject || !subject || subject === item.subject,
            subinfo: !item.subject ? '' : 'sub: ' + item.subject.slice(0, 4) + '...',
            formattedDate: new Date(item.time).toLocaleString('de-DE', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            })
        });
    })

    console.log('Measurements:', measurements)

    res.json(mappedMeasurements)
})

export default router