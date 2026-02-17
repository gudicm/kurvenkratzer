import { Server } from 'socket.io'

let io

export const initializeSockets = (server, sessionMiddleware) => {
    try {
        console.log('Initializing socket')
        io = new Server(server)

        io.engine.use(sessionMiddleware)

        io.use((socket, next) => {
            const session = socket.request.session
            if (!session || !session.passport || !session.passport.user) {
                return next(new Error('Unauthorized'))
            }
            next()
        })

        io.on('connection', (socket) => {
            const user = socket.request.session.passport.user
            socket.join('user:' + user)
            console.log('A new connection for user', user)

            socket.emit('sync')
        })
    } catch (e) {
        console.error('Socket init error:', e);
    }

}

export const askUserToSync = (userId) => {
    const room = `user:${userId}`
    console.log(`Sending sync to ${room}`)
    io.to('user:' + userId).emit('sync')
}
