// http://hthv013:9191/fhir/Observation?_pretty=true

export const loadObservations = async (token) => {

    const outHeaders = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
    }

    const response = await fetch('http://hthv013:9191/fhir/Observation?_pretty=true', {
        headers: outHeaders
    })

    console.log('Outgoing headers')
    console.log(outHeaders)

    const data = await response.json()
    console.log(data)
    console.log('Status', response.status, response.statusText)

}
