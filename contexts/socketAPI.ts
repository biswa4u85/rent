import io from 'socket.io-client';
const siteURL = 'https://chat-backend-release.ischoolconnect.com/chat'

class SocketApis {

    socket;

    constructor() {
        this.socket = io(siteURL, {
            transports: ['websocket'],
            auth: {
                accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjQxZDY1Y2U1OGFkMzk1NjQ1OWI2YjRjIiwiaWF0IjoxNjgzMjcxODE0LCJleHAiOjE2ODMzNjE4MTR9.eIfXUcR8ur12H_24boDMK1u5T2YZKaP1qhbJDbnsZAM"
            }
        })

        this.socket.on('connect', () => {
            // this.socket.emit('authenticate', "ssss");
            console.log('Socket connected')
        })
        this.socket.on('reconnect', function (attempt) {
            console.log('Socket reconnect', attempt)
        })
        this.socket.on('reconnect_error', function (err) {
            console.log(`Socket reconnect error ${err}`)
        })
        this.socket.on('reconnect_failed', function () {
            console.log(`Socket reconnect failed`)
        })
    }

    subscribe(type: any, name: any) {
        this.socket.emit(type, name)
    }

    unSubscribe(name: any) {
        this.socket.emit('unSubscribe', name)
    }

    getSocketData(name: any, cb: any) {
        this.socket.on(name, (data: any) => {
            cb(data)
        })
    }

}

export default new SocketApis();