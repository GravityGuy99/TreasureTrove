import mongoose, { Schema } from 'mongoose'

const postSchema = new Schema(
  {
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    contents: String,
    tags: [String],
    expiresAt: { type: Date }, //new field that defines when the post expires
    bid: { type: Number },
    image: { type: String },
    bids: [
      {
        amount: { type: Number, required: true },
        userId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
)

postSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export const Post = mongoose.model('post', postSchema)
