import express from 'express'
import {requireAuthentication} from '../middleware/authState.js'
import userStore from '../service/users.js'
import {PreNudgeConfig as Pn} from '../config.js'
import {extendAccessToken} from '../service/prenudge.js'

/**
 * This router handles the initial authorization process.
 */

const router = express.Router()

const getAuthUrl = () => {
    const params = {
        response_type: 'code',
        client_id: Pn.CLIENT_ID,
        scope: Pn.SCOPES,
        redirect_uri: Pn.CALLBACK,
        state: 'random-string'
    }

    const url = new URL(Pn.AUTH_URL)
    Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value)
    })

    console.log(url.toString())

    return url.toString()
}

const redeemCode = async (code, req, res) => {
    const params = new URLSearchParams()
    params.append('code', code)
    params.append('client_id', Pn.CLIENT_ID)
    params.append('client_secret', Pn.CLIENT_SECRET)
    params.append('grant_type', 'authorization_code')
    params.append('redirect_uri', Pn.CALLBACK) // TODO: Required?!
    params.append('scope', Pn.SCOPES)

    // Log the outgoing token request for easier server-side debugging
    console.log('RedeemCode POST body:', params.toString())

    let response
    try {
        response = await fetch(Pn.TOKEN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded', // TODO: Possible to use json?
            },
            body: params.toString()
        })
    } catch (err) {
        console.log('Token fetch failed:', err)
        res.render('authError', {status: 'Fetch Error', message: String(err)})
        return
    }

    let data
    try {
        data = await response.json()
    } catch (err) {
        console.log('Failed to parse token response as JSON:', err)
        data = null
    }

    console.log('Token response status', response.status, response.statusText)
    console.log('Token response body', data)

    if (response.status !== 200) {
        res.render('authError', {status: `${response.status}: ${response.statusText}`, message: data.error_description})
        // TODO: Should redirect to clear the URL
    } else {
        req.user.prenudgeCredentials = data
        userStore.updateUser(req.user).then((response) => {
            res.redirect('/home/prenudge')
        }).catch((err) => {
            console.log(err)
            res.redirect('/home/prenudge?err')
        })

    }

}

router.get('/authorize', requireAuthentication, function (req, res, next) {
    // Redirect to Keycloak to receive an auth code
    res.redirect(302, getAuthUrl())
})

router.get('/deauthorize', requireAuthentication, async function (req, res, next) {
    req.user.prenudgeCredentials = undefined
    await userStore.updateUser(req.user)

    res.redirect('/home/prenudge')
})

router.get('/callback', requireAuthentication, async function (req, res, next) {
    // Exchange the auth code for a token
    console.log(req.query)

    await redeemCode(req.query.code, req, res)
})

router.get('/clear', async function (req, res, next) {
    // TODO: Invalidate token
    req.session.token = undefined
    res.redirect('/')
})

router.get('/extend', async function (req, res, next) {
    const credentials = req.user.prenudgeCredentials
    extendAccessToken(credentials).then((newCredentials) => {
        req.user.prenudgeCredentials = newCredentials
        return userStore.updateUser(req.user)
    }).then(() => {
        req.flash('info', 'Der Token wurde verlängert.')
        res.redirect('/home/prenudge')
    }).catch(err => {
        console.log(err)
        req.flash('error', 'Der Token konnte nicht verlängert werden.')
        res.redirect('/home/prenudge')
    })
})

export default router
