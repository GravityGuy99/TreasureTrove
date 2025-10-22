import {app} from './app.js'
import dotenv from 'dotenv'
import {initDatabase} from './db/init.js'

dotenv.config()

try {
    await initDatabase()
    const PORT = process.env.PORT
    app.listen(PORT)
    console.info(`Express server running on https://localhost:${PORT}`)
} catch(err) {
    console.error(`Error connecting to database: ${err}`)
}


