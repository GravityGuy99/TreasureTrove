import { createUser, loginUser, getUserInfoById, addTokens } from '../services/users.js'
import { requireAuth } from '../middleware/jwt.js'

export function userRoutes(app) {
    app.get('/api/v1/users/:id', async (req, res) => {
        const userInfo = await getUserInfoById(req.params.id)
        return res.status(200).send(userInfo)
    })
    app.post('/api/v1/user/login', async (req, res) => {
        try {
            const token = await loginUser(req.body)
            return res.status(200).send({token})
        } catch (err) {
            return res.status(400).send({
                error: 'login failed, did you enter the correct username/password?'
            })
        }
    })
    // Add tokens to the currently authenticated user
    app.post('/api/v1/user/tokens', requireAuth, async (req, res) => {
        try {
            const userId = req.auth && req.auth.sub
            if (userId == null) return res.status(401).send({ error: 'unauthenticated' })
            const tokens = await addTokens(userId)
            return res.status(200).send({ tokens })
        } catch (err) {
            console.error('error adding tokens: ', err)
            return res.status(400).send({ error: 'failed to add tokens' })
        }
    })
    app.post('/api/v1/user/signup', async (req, res) => {
        try {
            const user = await createUser(req.body)
            return res.status(201).json({username: user.username})
        } catch (err) {
            console.error('error adding user: ', err)
            return res.status(400).json({
                error: 'failed to create the user, does the username already exist?'
            })
        }
    })
}