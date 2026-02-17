import userStore from './users.js'
import measurementStore from './measurements.js'
import * as jose from 'jose'
import { PreNudgeConfig as Pn } from '../config.js'

export const sendToPrenudge = async (measurement) => {

    console.log('Starting to sync measurement', measurement.id)

    let subject;

    return getAccessToken(measurement.userId)
        .then((accessToken) => {
            subject = jose.decodeJwt(accessToken).sub
            const fhirMeasurement = getMeasurementAsFhirResource(measurement, subject)

            const url = Pn.FHIR_ENDPOINT + '/Observation/' + measurement.id
            console.log('access token:', accessToken)
            return fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/fhir+json',
                    'Accept': 'application/fhir+json',
                    'Authorization': 'Bearer ' + accessToken
                },
                body: JSON.stringify(fhirMeasurement),
            })

        })
        .then((response) => {
            console.log(`Sync succeeded with ${response.status} ${response.statusText}.`);
            response.json()
                .then(json => {
                    console.log(json)
                    return measurementStore.updateSyncStatus(measurement.id, true, subject, response.status, response.statusText, json);
                })
                .catch(err => console.log('The response could not be parsed as json.', err));
        })
        .catch(err => {
            console.log('Uploading data fasyiled.')
            console.log(JSON.stringify(err, null, 2))
            console.log(err.response.data.issue)
        })
}

/**
 * Get the access token for the user.
 * If the token is invalid, an attempt to refresh it is made.
 * @param userId
 * @returns {Promise<Awaited<*>>} token
 */
const getAccessToken = async (userId) => {

    const user = userStore.getUserById(userId)

    if (!user) {
        return Promise.reject(new Error(`User ${userId} not found.`))
    }

    if (!user.prenudgeCredentials) {
        return Promise.reject(new Error('No PreNudge credentials found.'))
    }

    let accessToken = user.prenudgeCredentials.access_token
    let didRefreshToken = false

    if (!isTokenValid(accessToken)) {
        console.log('Access token is not valid. Attempting to refresh it.')

        user.prenudgeCredentials = await extendAccessToken(user.prenudgeCredentials)
        didRefreshToken = true
        await userStore.updateUser(user)
    }

    // We could use recursion instead.
    if (didRefreshToken && !user.prenudgeCredentials) {
        return Promise.reject(new Error('Failed to refresh the token'))
    }

    return Promise.resolve(user.prenudgeCredentials.access_token)
}

const getMeasurementAsFhirResource = (measurement, subject) => {
    return {
        resourceType: 'Observation',
        id: measurement.id,
        status: 'final',
        code: {
            coding: [
                {
                    system: 'http://loinc.org',
                    code: '15074-8',
                    display: 'Blutzucker'
                }
            ],
            text: 'Blood glucose'
        },
        subject: {
            reference: `Patient/${subject}`
        },
        effectiveDateTime: measurement.time,
        issued: measurement.time,
        valueQuantity: {
            value: measurement.value,
            unit: 'mg/dl',
            system: 'http://unitsofmeasure.org',
            code: 'mg/dl'
        }
    }
}

export const isTokenValid = (accessToken) => {
    if (!accessToken) {
        return false
    }
    const decoded = jose.decodeJwt(accessToken)
    if (!decoded) {
        return false
    }
    const exp = decoded.exp * 1000
    const now = new Date().getTime()
    return exp > now
}

export const extendAccessToken = async (credentials) => {
    const params = new URLSearchParams()
    params.append('client_id', Pn.CLIENT_ID)
    params.append('client_secret', Pn.CLIENT_SECRET)
    params.append('grant_type', 'refresh_token')
    params.append('refresh_token', credentials.refresh_token)

    const response = await fetch(Pn.TOKEN_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded', // TODO: Possible to use json?
        },
        body: params.toString()
    })

    const data = await response.json()
    console.log('Refresh token exchange done:')
    console.log(data)
    console.log('Status', response.status, response.statusText)

    if (response.status !== 200) {
        console.log('Refreshing the token failed')
        return undefined
    }

    console.log('Extending the token worked')
    return data
}
