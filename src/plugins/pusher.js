import Pusher from 'pusher-js'
const API_URL = import.meta.env.VITE_APP_ATOMIC_API
const PUSHER_ID = import.meta.env.VITE_APP_PUSHER
const PUSHER_CLUSTER = import.meta.env.VITE_APP_PUSHER_CLUSTER

let pusherInstance

export default {
  install() {
    Pusher.logToConsole = true

    pusherInstance = new Pusher(PUSHER_ID, {
      cluster: PUSHER_CLUSTER,
      encrypted: true,
      authEndpoint: `${API_URL}/task-workflow/socket`,
      auth: {
        headers: {
          'x-public-token': localStorage.token
        }
      },
      enabledTransports: ['wss', 'ws'],
      activityTimeout: 15000,
      pongTimeout: 8000
    })

    pusherInstance.connection.bind('error', (error) => {
      console.error(error)
    })
  },
  get() {
    if (!pusherInstance) this.install()
    return pusherInstance
  }
}
