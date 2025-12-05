import mongoose, { Schema } from 'mongoose'

const userSchema = new Schema ({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    tokens: {type: Number, required: true, default: 0},
    reservedTokens: { type: Number, required: true, default: 0 },
})

export const User = mongoose.model('user', userSchema)