import {app} from './app.js'
import dotenv from 'dotenv'
import {initDatabase} from './db/init.js'
import { resolveExpiredPosts } from './services/post.js'

dotenv.config()

try {
    await initDatabase()
    const PORT = process.env.PORT
    app.listen(PORT)
    console.info(`Express server running on https://localhost:${PORT}`)
    // Periodically resolve expired posts (every 60 seconds)
    setInterval(() => {
        resolveExpiredPosts().catch((err) => console.error('error resolving expired posts:', err))
    }, 60 * 1000)
} catch(err) {
    console.error(`Error connecting to database: ${err}`)
}