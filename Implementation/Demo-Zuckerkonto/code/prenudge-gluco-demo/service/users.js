import crypto from 'crypto'
import {v4 as uuidv4} from 'uuid'
import db from './db.js'
import {AppConfig} from '../config.js'

class UserStore {

    hashPassword(password) {
        return crypto.createHash('sha256').update(password).digest('hex')
    }

    async addUser(username, password, props = {}) {
        const existingUser = this.getUserByUsername(username)
        if (existingUser) {
            return Promise.reject('User already exists')
        }
        const user = {
            id: uuidv4(),
            username,
            passwordHash: this.hashPassword(password),
            targetBgLower: AppConfig.TARGET_BG_LOWER,
            targetBgUpper:  AppConfig.TARGET_BG_UPPER,
            ...props,
        }
        await db.update(({users}) => users.push(user))
        return user
    }

    getUserByCredentials(username, password) {
        const {users} = db.data
        const passwordHash = this.hashPassword(password)
        return users.find(
            (u) => u.username === username && u.passwordHash === passwordHash
        )
    }

    getUserByUsername(username) {
        const {users} = db.data
        return users.find((u) => u.username === username)
    }

    getUserById(id) {
        const {users} = db.data
        return users.find((u) => u.id === id)
    }

    async updateUser(updatedUser) {
        console.log('Asked to update user with id', updatedUser.id, ':', updatedUser)
        const users = db.data.users
        const index = users.findIndex((u) => u.id === updatedUser.id)
        if (index === -1) return null

        // Merge old + new (but never overwrite ID unless explicitly provided)
        users[index] = {
            ...users[index],
            ...updatedUser,
            id: users[index].id, // keep existing ID
        }

        await db.write()
        return users[index]
    }

    async saveBgTargetRange(username, lower, upper) {
        console.log('Save bg target range lower=', lower , '[mg/dl] upper=', upper, '[mg/dl] for user ', username)
        const users = db.data.users
        const user = users.find((u) => u.username === username)
        if (!user) return null

        user.targetBgLower = parseInt(lower, 10)
        user.targetBgUpper = parseInt(upper, 10)
        await db.write()
        console.log('Saved user: ', user)
        return user
    }

}

const userStore = new UserStore()
export default userStore
