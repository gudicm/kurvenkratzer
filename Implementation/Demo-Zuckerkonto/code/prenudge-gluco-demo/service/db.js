import {Low} from 'lowdb'
import {JSONFile} from 'lowdb/node'
import {AppConfig} from '../config.js'

const file = process.env.DB_FILE || './db.json'

const adapter = new JSONFile(file)
const db = new Low(adapter, {
    users: [{
        id: 'markus-statikus',
        username: 'markus',
        passwordHash: '24d9c7b19834aa278ce9609a00d156f61bd83184c2634d1c2b1d6aaa9c235b3a'
    }], measurements: []
}) // default data

export async function initDb() {
    await db.read()
    //db.data ||= {users: [], measurements: []}

    // Durchlaufe alle User und setze den Zielbereich
    db.data.users.forEach(user => {
        if (user.targetBgLower === undefined || typeof user.targetBgLower === 'string') {
            user.targetBgLower = AppConfig.TARGET_BG_LOWER;
        }
        if (user.targetBgUpper === undefined || typeof user.targetBgUpper === 'string') {
            user.targetBgUpper = AppConfig.TARGET_BG_UPPER;
        }
    });

    db.data.measurements.forEach(bg => {
        if (bg.targetBgLower === undefined || typeof bg.targetBgLower === 'string') {
            bg.targetBgLower = AppConfig.TARGET_BG_LOWER;
        }
        if (bg.targetBgUpper === undefined || typeof bg.targetBgUpper === 'string') {
            bg.targetBgUpper = AppConfig.TARGET_BG_UPPER;
        }
    });

    await db.write()
    return db
}

export default db
