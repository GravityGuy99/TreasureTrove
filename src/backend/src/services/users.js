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
        return {username: user.username, tokens: user.tokens ?? 0, reservedTokens: user.reservedTokens ?? 0}
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

export async function deductTokens(userId, amount) {
    const ded = Number(amount)
    if (Number.isNaN(ded) || ded <= 0) throw new Error('invalid amount')
    const user = await User.findById(userId)
    if (!user) throw new Error('user not found')
    if ((user.tokens ?? 0) < ded) throw new Error('insufficient tokens')
    user.tokens = (user.tokens ?? 0) - ded
    await user.save()
    return user.tokens
}

export async function reserveTokens(userId, amount) {
    const amt = Number(amount)
    if (Number.isNaN(amt) || amt <= 0) throw new Error('invalid amount')
    const user = await User.findOneAndUpdate(
        { _id: userId, tokens: { $gte: amt } },
        { $inc: { tokens: -amt, reservedTokens: amt } },
        { new: true }
    )
    if (!user) throw new Error('insufficient tokens to reserve')
    return { tokens: user.tokens, reservedTokens: user.reservedTokens }
}

export async function releaseReservedTokens(userId, amount) {
    const amt = Number(amount)
    if (Number.isNaN(amt) || amt <= 0) throw new Error('invalid amount')
    const user = await User.findOneAndUpdate(
        { _id: userId, reservedTokens: { $gte: amt } },
        { $inc: { tokens: amt, reservedTokens: -amt } },
        { new: true }
    )
    if (!user) throw new Error('not enough reserved tokens to release')
    return { tokens: user.tokens, reservedTokens: user.reservedTokens }
}

export async function finalizeReservedTokens(userId, amount) {
    // Finalize reservation when user wins: reduce reservedTokens (tokens already removed from available)
    const amt = Number(amount)
    if (Number.isNaN(amt) || amt <= 0) throw new Error('invalid amount')
    const user = await User.findOneAndUpdate(
        { _id: userId, reservedTokens: { $gte: amt } },
        { $inc: { reservedTokens: -amt } },
        { new: true }
    )
    if (!user) throw new Error('insufficient reserved tokens to finalize')
    return { reservedTokens: user.reservedTokens }
}