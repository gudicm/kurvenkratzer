import {v4 as uuidv4} from 'uuid'
import db from './db.js'
import {askUserToSync} from '../ws.js'

class MeasurementStore {

    async create({value, userId, targetBgLower, targetBgUpper, time = new Date()}) {
        const measurement = {
            id: uuidv4(),
            value: parseInt(value, 10),
            userId,
            syncedToPrenudge: false,
            time: new Date(time).toISOString(),
            targetBgLower: targetBgLower,
            targetBgUpper: targetBgUpper
        }

        db.data.measurements.push(measurement)
        await db.write()
        askUserToSync(measurement.userId)
        return measurement
    }

    async delete(id) {
        const index = db.data.measurements.findIndex(m => m.id === id)
        if (index === -1) return false

        db.data.measurements.splice(index, 1)
        await db.write()
        return true
    }

    async updateSyncStatus(id, synced, subject, status, statusText, fhirOutcome) {
        const measurement = db.data.measurements.find(m => m.id === id)
        if (!measurement) return null

        measurement.syncedToPrenudge = Boolean(synced)
        measurement.subject = subject;
        measurement.status = status;
        measurement.statusText = statusText;
        measurement.fhirOutcome = fhirOutcome;
        await db.write()
        askUserToSync(measurement.userId)
        return measurement
    }

    async findNewestByUser(userId, limit = 10) {
        return db.data.measurements
            .filter(m => m.userId === userId)
            .sort((a, b) => new Date(b.time) - new Date(a.time))
            .slice(0, limit)
    }

    async findAllByUser(userId) {
        return db.data.measurements.filter(m => m.userId === userId)
    }

    async findUnsyncedByUser(userId) {
        return db.data.measurements.filter(
            m => m.userId === userId && !m.syncedToPrenudge
        )
    }

    async getSumByUser(userId) {
        return db.data.measurements
            .filter(m => m.userId === userId)
            .reduce((sum, m) => sum + m.value, 0)
    }

    async getPreNudgeOkCtn(userId) {
        return db.data.measurements
            .filter(m => m.userId === userId && m.syncedToPrenudge && m.status < 300)
            .length
    }

    async getPreNudgeErrorCtn(userId) {
        return db.data.measurements
            .filter(m => m.userId === userId && m.syncedToPrenudge && m.status >= 300)
            .length
    }

    async getInBgRangeCtn(userId) {
        return db.data.measurements
            .filter(m => m.userId === userId &&
                (
                    m.value >= m.targetBgLower && m.value <= m.targetBgUpper
                )
            )
            .length
    }

    async getOutOfBgRangeCtn(userId) {
        return db.data.measurements
            .filter(m => m.userId === userId &&
                (
                    m.value < m.targetBgLower || m.value > m.targetBgUpper
                )
            )
            .length
    }

}

export default new MeasurementStore()
