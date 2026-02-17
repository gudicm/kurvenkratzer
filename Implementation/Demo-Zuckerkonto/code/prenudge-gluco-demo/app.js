import httpTrace from './middleware/http-trace.js'
import createError from 'http-errors'
import express from 'express'
import path from 'path'
import {fileURLToPath} from 'url'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import favicon from 'serve-favicon'
import flash from 'connect-flash'

import session from 'express-session'
import lowdbStore from 'connect-lowdb'
import db from './service/db.js'

import {authState} from './middleware/authState.js'
import templateVars from './middleware/templateVars.js'
import passport from './middleware/passport.js'

import indexRouter from './routes/index.js'
import homeRouter from './routes/home.js'
import prenudgeRouter from './routes/prenudge.js'
import authRouter from './routes/auth.js'
import apiRouter from './routes/api.js'

import hbs from 'hbs'
import dateFormat from 'handlebars-dateformat'

const app = express()

// Create ESM equivalents for CommonJS vars
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

hbs.registerHelper('dateFormat', dateFormat)

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))

// incoming request tracing (no-op unless TRACE_HTTP=true)
app.use(httpTrace)

const LowdbStore = lowdbStore(session)
const sessionMiddleware = session(
    {
        store: new LowdbStore({db}),
        secret: 'prenüdge',
        cookie: {
            maxAge: 24 * 60 * 60 * 1000
        },
        resave: true,
        saveUninitialized: false
    })

app.use(sessionMiddleware)

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.use(authState)
app.use(templateVars)
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use('/hbs', express.static('node_modules/handlebars/dist'))
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.png')))

app.use('/precompiled', (req, res, next) => {
    if (!req.path.endsWith('.js')) return res.status(404).end()
    express.static(path.join(__dirname, 'views-precompiled'))(req, res, next)
})

app.use('/', indexRouter)
app.use('/home', homeRouter)
app.use('/home/prenudge', prenudgeRouter)
app.use('/auth', authRouter)
app.use('/api', apiRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render('error')
})

export {app, sessionMiddleware}
