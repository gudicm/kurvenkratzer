export function authState(req, res, next) {
    res.locals.user = req.user || null
    res.locals.isLoggedIn = !!req.user
    req.isAuthenticated = !!req.user
    res.locals.hasPrenudge = req.user && req.user.prenudgeCredentials
    next()
}

export function requireAuthentication(req, res, next) {
    if (!req.isAuthenticated) {
        console.log('Authentication is required for', req.url, '- user is not authenticated')
        res.redirect('/login')
    } else {
        next()
    }
}
