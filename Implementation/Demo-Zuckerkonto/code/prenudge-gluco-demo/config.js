export const AppConfig = {
    TITLE: 'Zuckerkonto',
    SUBTITLE: 'Das süßeste Konto weit und breit.',
    TARGET_BG_LOWER: 70,
    TARGET_BG_UPPER: 180
}

export const PreNudgeConfig = {
    TOKEN_URL: 'https://keycloak.test.health.joanneum.at/realms/PreNudge/protocol/openid-connect/token',
    AUTH_URL: 'https://keycloak.test.health.joanneum.at/realms/PreNudge/protocol/openid-connect/auth',
    CLIENT_ID: 'zuckerkonto',
    CLIENT_SECRET: 'pG4QkQ5eRMyx7N6Dd8Bjma1kbjfV14I8',
    // CLIENT_ID: 'zuckerkonto',
    // CLIENT_SECRET: 'pG4QkQ5eRMyx7N6Dd8Bjma1kbjfV14I8',
    // CLIENT_ID: 'kurvenkratzer',
    // CLIENT_SECRET: 'nIM4xlU6KM9YIBSOftbl3P7HV1QzhWB2',
    // CLIENT_ID: 'pandox',
    // CLIENT_SECRET: 't4D5EJMib9EXmdiNNz1VGqfixPb45wJk',
    // CLIENT_ID: 'medicus-ai',
    // CLIENT_SECRET: 'MCyiscEgdokGXtRfrGO67iZgjVeaAanf',
    // CLIENT_ID: 'telbiomed',
    // CLIENT_SECRET: 'wQkHwMXO46jorsQYBznSou3o9ZyMQAw7',
    // CLIENT_ID: 'pairwise-01',
    // CLIENT_SECRET: 'rwtiFOyR3TGW5eU400tNTQmYNOVmB843',
    FHIR_ENDPOINT: process.env.FHIR || 'https://fhir.dev.prenudge.at/fhir',
    SCOPES: 'offline_access write_observation openid',
    CALLBACK: process.env.CALLBACK || 'http://localhost:3000/auth/callback'
}
