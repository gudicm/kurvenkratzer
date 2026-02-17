import {AppConfig} from '../config.js'

export default function authState(req, res, next) {
    res.locals.title = AppConfig.TITLE
    res.locals.subtitle = AppConfig.SUBTITLE
    next()
}
