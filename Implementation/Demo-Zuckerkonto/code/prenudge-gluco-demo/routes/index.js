import express from 'express'
import passport from '../middleware/passport.js'
import {loadObservations} from '../service/fhir.js'
import userStore from '../service/users.js'

const router = express.Router()

router.get('/', (req, res) => {
    if (req.isAuthenticated) {
        res.redirect('/home')
    } else {
        res.render('index', {success: req.flash('success')})
    }
})

router.get('/observations', async (req, res, next) => {
    await loadObservations(req.session.token)
    res.redirect('/')
})

router.get('/login', (req, res) => {
    res.locals.isOnSignInPage = true
    res.render('login')
})

router.get('/register', (req, res) => {
    res.locals.isOnSignInPage = true
    res.render('register', {error: req.flash('error')})
})

router.post('/register', (req, res) => {
    userStore.addUser(req.body.username, req.body.password).then(user => {
        req.flash('success', 'Die Registierung war erfolgreich. Du kannst dich jetzt einloggen und lossparen.')
        res.redirect('/')
    }).catch(err => {
        req.flash('error', 'Es ist ein Fehler aufgetreten. Hast du vielleicht schon ein Konto?')
        res.redirect('/register')
    })
})

router.get('/logout', (req, res) => {
    req.logout((err) => {
        res.redirect('/')
    })
})

router.get('/sneak', (req, res) => {
    const user = userStore.getUserByCredentials('markus', 'markus')
    req.login(user, (err) => {
        if (err) {
            console.log(err)
            res.redirect('/login?nosneak')
        } else {
            res.redirect('/')
        }
    })
})

const authMiddleware = passport.authenticate('local', {failureRedirect: '/login', failureMessage: true})
router.post('/login', authMiddleware, (req, res) => {
    res.redirect('/?' + req.user.username)
})

export default router
