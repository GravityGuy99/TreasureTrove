import mongoose, {Schema} from 'mongoose'

const postSchema = new Schema({
    title: {type: String, required: true},
    author: {type: Schema.Types.ObjectId, ref: 'user', required:true},
    contents: String,
    tags: [String],
    expiresAt: {type: Date}, //new field that defines when the post expires
},
{timestamps: true},
)

postSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export const Post = mongoose.model('post', postSchema)