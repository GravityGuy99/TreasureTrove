import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../db/models/user.js'

export async function loginUser({username, password}) {
    const user = await User.findOne({username})
    console.log("%s", username)
    if(!user){
        throw new Error('invalid username!')
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if(!isPasswordCorrect) {
        throw new Error('invalid password!')
    
    }
    const token = jwt.sign({sub: user._id}, process.env.JWT_SECRET, {
        expiresIn: '24h'
    })

    return token
}

export async function createUser({username, password}) {
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new User({username, password:hashedPassword})
    return await user.save()
}

export async function getUserInfoById(userId) {
    try{
        const user = await User.findById(userId)
        if (!user) return {username: userId}
        return {username: user.username, tokens: user.tokens ?? 0}
    } catch (err) {
        return {username: userId}
    }
}

export async function addTokens(userId) {
    // Fixed amount of tokens to add when this endpoint is called.
    // Keep in sync with the frontend ADD_AMOUNT constant.
    const inc = 1000
    const user = await User.findByIdAndUpdate(
        userId,
        { $inc: { tokens: inc } },
        { new: true }
    )
    if (!user) throw new Error('user not found')
    return user.tokens
}