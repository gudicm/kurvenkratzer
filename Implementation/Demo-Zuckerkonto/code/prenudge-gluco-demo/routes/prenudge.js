import express from 'express'
import {requireAuthentication} from '../middleware/authState.js'
import * as jose from 'jose'
import {isTokenValid} from '../service/prenudge.js'

const router = express.Router()

/**
 * PreNudge related urls go here. They need to be authenticated
 * /home/prenudge
 */

router.all('*', requireAuthentication)

router.get('/', (req, res) => {
    res.locals.jsonCredentials = JSON.stringify(req.user.prenudgeCredentials, null, 2)

    if (req.user.prenudgeCredentials) {
        const jwt = req.user.prenudgeCredentials.access_token
        const decoded = jose.decodeJwt(jwt)
        res.locals.subject = decoded.sub
        res.locals.jsonToken = JSON.stringify(decoded, null, 2)
        res.locals.isTokenValid = isTokenValid(jwt)
        res.locals.tokenExpiry = new Date(decoded.exp * 1000)
    }

    res.render('prenudge', {info: req.flash('info'), error: req.flash('error')})
})

export default router