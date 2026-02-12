# Application Integration Analysis

The application communicates with a third-party system called **PreNudge**. This integration is handled entirely on the backend (Node.js) and involves two main external services: an **Identity Provider (Keycloak)** and a **FHIR Server** for medical data.

Here are the specific integration points found in the code:

### 1. Medical Data Synchronization (FHIR)
The application sends blood glucose measurements to an external **FHIR (Fast Healthcare Interoperability Resources)** server.

*   **Evidence:** In [`service/prenudge.js`](../service/prenudge.js), the function `sendToPrenudge` constructs a standard FHIR `Observation` resource and sends it via an HTTP `PUT` request.
*   **Target:** The URL is defined in [`config.js`](../config.js) as `PreNudgeConfig.FHIR_ENDPOINT`.
*   **Code Executed:**
    ```javascript
    // service/prenudge.js
    // ...existing code...
            const url = Pn.FHIR_ENDPOINT + '/Observation/' + measurement.id

            return fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/fhir+json',
                    'Accept': 'application/fhir+json',
                    'Authorization': 'Bearer ' + accessToken
                },
                body: JSON.stringify(fhirMeasurement),
            })
    // ...existing code...
    ```

### 2. External Authentication (OAuth2 / OpenID Connect)
The app uses an external Keycloak server to authorize access to the FHIR server. This uses the OAuth2 protocol (Authorization Code Flow).

*   **Evidence:** [`routes/auth.js`](../routes/auth.js) handles the redirect to the external login page and exchanges the returned "code" for an access token.
*   **Token Refreshing:** If the token expires, the app automatically connects to the external token endpoint to refresh it in [`service/prenudge.js`](../service/prenudge.js) via `extendAccessToken`.
*   **Configuration:** The endpoints are defined in [`config.js`](../config.js).
    ```javascript
    // config.js
    // ...existing code...
    export const PreNudgeConfig = {
        TOKEN_URL: 'https://keycloak.test.health.joanneum.at/realms/PreNudge/protocol/openid-connect/token',
        AUTH_URL: 'https://keycloak.test.health.joanneum.at/realms/PreNudge/protocol/openid-connect/auth',
    // ...existing code...
    ```

### 3. Communication Protocols
*   **WebSocket (`socket.io`):** Used **internally only** between the application server and the client's browser. Its purpose is to trigger immediate UI updates (via the `sync` event) when new data is added, without reloading the page. It is **not** used for any third-party communication.
*   **HTTP/REST:** Used for all **third-party integrations**. The application communicates with the FHIR server and Keycloak Identity Provider using standard HTTP/1.1 requests (`fetch` API) with JSON payloads and Bearer Token authentication.

### HL7 FHIR — Standards & links

The FHIR integration in this project follows the HL7 FHIR standard. Useful authoritative references:

- Official HL7 FHIR site: https://www.hl7.org/fhir/
- FHIR Specification (R4): https://hl7.org/fhir/R4/
- FHIR Specification (R5): https://hl7.org/fhir/R5/
- FHIR REST API (HTTP rules): https://hl7.org/fhir/http.html
- Terminologies & ValueSets (LOINC/SNOMED): https://www.hl7.org/fhir/terminologies.html
- SMART on FHIR (app launch & security): https://smarthealthit.org/ and https://hl7.org/fhir/smart-app-launch/
- Implementation guides & tooling: https://www.hl7.org/fhir/implementationguide.html
- HAPI FHIR (developer server & library): https://hapifhir.io/
- Public SMART/FHIR test sandbox: https://launch.smarthealthit.org/

Add these links as references for implementing or testing the `Observation` uploads and OAuth/OIDC integration with Keycloak.

### Mapping: `/Observation/` implementation → FHIR specification

This project issues `PUT {FHIR_ENDPOINT}/Observation/{id}` with a FHIR `Observation` JSON body and Bearer token auth. The relevant parts of the FHIR specification are:

- HTTP Update interaction (PUT): https://hl7.org/fhir/http.html#update — describes semantics for `PUT` to update or create a resource at a client-supplied id and typical responses (200/201).
- FHIR media types and content negotiation: https://hl7.org/fhir/http.html#mime-types — use of `application/fhir+json` for requests and responses.
- `Observation` resource definition (elements to populate for glucose measurements): https://hl7.org/fhir/R4/observation.html — covers `status`, `code`, `subject`, `effective[x]`, `valueQuantity`, `component`, and examples.
- Terminologies and coding (LOINC for lab/measurements, UCUM for units): https://www.hl7.org/fhir/terminologies.html — recommended for `code` and `valueQuantity.unit`.
- Error handling and `OperationOutcome` responses: https://hl7.org/fhir/R4/operationoutcome.html and https://hl7.org/fhir/http.html#errors — servers return structured errors and appropriate HTTP codes.
- Security and SMART on FHIR OAuth/OIDC guidance (scopes and access patterns used with Keycloak): https://hl7.org/fhir/security.html and https://hl7.org/fhir/smart-app-launch/ — use Authorization Code flow and SMART scopes for clinical resource access.
- Concurrency and conditional update hints (ETag/If-Match, idempotency): https://hl7.org/fhir/http.html#concurrency — optional controls for safe concurrent updates.

Recommended actions when integrating or testing:

- Ensure `Observation` JSON follows the `Observation` resource structure in the spec and uses standard codes (LOINC) and units (UCUM).
- Use `Content-Type: application/fhir+json` and `Accept: application/fhir+json` as the app already does.
- Handle 200/201 responses and parse `OperationOutcome` on errors.
- For OAuth, request minimal SMART scopes (e.g., `user/Observation.write` or server-level equivalents) and validate tokens per OIDC guidance.
- For testing, use the public SMART sandbox (https://launch.smarthealthit.org/) or a HAPI FHIR test server (https://hapifhir.io/).

This mapping ties the app's `service/prenudge.js` behavior directly to the authoritative FHIR spec sections above, helping reviewers and implementers verify conformance.

### 'Observability' implementation
In order to send a measurement to PreNudge, the app first needs to obtain an access token from the Keycloak Identity Provider. This is done in the `extendAccessToken` function in [`service/prenudge.js`](../service/prenudge.js). The function checks if the current token is expired and, if so, makes a POST request to the Keycloak token endpoint to refresh it using the stored refresh token.
FHIR server configuration and credentials are stored in the `config.js` file, and the app uses these to authenticate and send data to the FHIR server.

```javascript
// Simple example: sendToPrenudge (minimal, illustrative)
export const sendToPrenudge = async (measurement, accessToken, fhirEndpoint) => {
    const fhirObservation = {
        resourceType: 'Observation',
        id: measurement.id,
        status: 'final',
        code: {
            coding: [{ system: 'http://loinc.org', code: '15074-8', display: 'Blood glucose' }],
            text: 'Blood glucose'
        },
        subject: { reference: `Patient/${measurement.patientId || 'unknown'}` },
        effectiveDateTime: measurement.time,
        issued: measurement.time,
        valueQuantity: { value: measurement.value, unit: 'mg/dl', system: 'http://unitsofmeasure.org', code: 'mg/dl' }
    };

    const url = `${fhirEndpoint.replace(/\/$/, '')}/Observation/${measurement.id}`;
    const res = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/fhir+json',
            'Accept': 'application/fhir+json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(fhirObservation)
    });

    if (!res.ok) {
        const errBody = await res.text().catch(() => null);
        throw new Error(`FHIR upload failed: ${res.status} ${res.statusText} - ${errBody}`);
    }

    return res.json().catch(() => ({}));
};
```

