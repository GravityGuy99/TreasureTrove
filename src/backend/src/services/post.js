import { Post } from '../db/models/post.js'
import { User } from '../db/models/user.js'

//I've added all the new fields in createPost
export async function createPost(
  userId,
  { title, contents, tags, expiresAt, bid, image },
) {
  console.log('inside services createPost')

  // Generate next ID by finding the max existing ID and incrementing
  let maxPost = await Post.findOne().sort({ id: -1 }).limit(1)
  const nextId = maxPost ? maxPost.id + 1 : 1

  const post = new Post({
    id: nextId,
    title,
    author: userId,
    contents,
    tags,
    expiresAt: expiresAt ? new Date(expiresAt) : undefined,
    bid,
    image,
  })
  return await post.save()
}

async function listPosts(
  query = {},
  { sortBy = 'createdAt', sortOrder = 'descending' } = {},
) {
  return await Post.find(query).sort({ [sortBy]: sortOrder })
}

export async function listAllPosts(options) {
  return await listPosts({}, options)
}

export async function listPostsByAuthor(authorUsername, options) {
  const user = await User.findOne({ username: authorUsername })
  if (!user) return []
  return await listPosts({ author: user._id }, options)
}

export async function listPostsByTag(tags, options) {
  return await listPosts({ tags }, options)
}

export async function getPostById(postID) {
  return await Post.findOne({ id: postID })
}

export async function updatePost(userId, postID, { title, contents, tags }) {
  return await Post.findOneAndUpdate(
    { _id: postID, author: userId },
    { $set: { title, contents, tags } },
    { new: true },
  )
}

export async function deletePost(userId, postId) {
  return await Post.deleteOne({ _id: postId, author: userId })
}

export async function placeBid(userId, postId, amount) {
  const post = await Post.findOne({ id: postId })
  if (!post) throw new Error('Post not found')

  // Check if post has expired
  if (post.expiresAt && new Date(post.expiresAt) < new Date()) {
    throw new Error('Bidding has ended for this item')
  }

  // Calculate current highest bid
  const currentHighest =
    post.bids && post.bids.length > 0
      ? Math.max(...post.bids.map((b) => b.amount))
      : post.bid || 0

  // Validate new bid is higher
  if (amount <= currentHighest) {
    throw new Error(`Bid must be higher than current bid of ${currentHighest}`)
  }

  // Add the new bid
  const updatedPost = await Post.findOneAndUpdate(
    { id: postId },
    {
      $push: {
        bids: {
          amount,
          userId,
          timestamp: new Date(),
        },
      },
    },
    { new: true },
  )

  return updatedPost
}
