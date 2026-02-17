import passport from 'passport'
import {Strategy as LocalStrategy} from 'passport-local'
import userStore from '../service/users.js'

passport.use(
    new LocalStrategy((username, password, done) => {
        const user = userStore.getUserByCredentials(username, password)
        if (!user) {
            return done(null, false, {message: 'Incorrect username or password'})
        }
        return done(null, user)
    })
)

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    const user = userStore.getUserById(id)
    done(null, user || false)
})

export default passport
