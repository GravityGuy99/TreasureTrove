import { Post } from '../db/models/post.js'
import { User } from '../db/models/user.js'
import { reserveTokens, releaseReservedTokens, finalizeReservedTokens } from './users.js'

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

  // Manage reservations:
  // - If the bidder already has a previous bid on this post, only reserve the difference.
  // - Release reservation of previous highest bidder if they are outbid.
  const bidsForPost = post.bids || []
  const prevHighest = bidsForPost.length > 0 ? bidsForPost.slice().sort((a, b) => b.amount - a.amount)[0] : null

  // Calculate bidder's previous max bid on this post
  const userPrevBids = bidsForPost.filter((b) => String(b.userId) === String(userId))
  const userPrevMax = userPrevBids.length > 0 ? Math.max(...userPrevBids.map((b) => b.amount)) : 0
  const neededReserve = amount - userPrevMax

  let reservedDone = false
  try {
    if (neededReserve > 0) {
      // try to reserve additional tokens for this bidder
      await reserveTokens(userId, neededReserve)
      reservedDone = true
    }

    // If there was a previous highest bidder and it's not the same user, release their reservation
    if (prevHighest && String(prevHighest.userId) !== String(userId)) {
      try {
        await releaseReservedTokens(prevHighest.userId, prevHighest.amount)
      } catch (err) {
        // log but continue — releasing may fail if data inconsistent
        console.warn('failed to release reserved tokens for previous highest bidder', err)
      }
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
  } catch (err) {
    // If we reserved tokens but failed to persist the bid, release the reservation to avoid locking funds.
    if (reservedDone) {
      try {
        await releaseReservedTokens(userId, neededReserve)
      } catch (releaseErr) {
        console.error('failed to rollback reserved tokens after bid failure', releaseErr)
      }
    }
    throw err
  }
}

// Find posts whose expiration has passed and haven't been closed yet.
// For each, determine the winning bid (highest) and deduct tokens from the winner.
export async function resolveExpiredPosts() {
  const now = new Date()
  const expired = await Post.find({ expiresAt: { $lte: now }, closed: { $ne: true } })
  const results = []
  for (const post of expired) {
    // Sort bids by amount
    const bidsSorted = (post.bids || []).slice().sort((a, b) => b.amount - a.amount)

    let resolvedWinner = null
    let resolvedPrice = null

    // Try each bidder in descending order until one can pay (finalize their reserved tokens)
    for (const b of bidsSorted) {
      const bidderId = b.userId
      const price = b.amount
      try {
        await finalizeReservedTokens(bidderId, price)
        // success
        resolvedWinner = bidderId
        resolvedPrice = price
        break
      } catch (err) {
        // insufficient reserved tokens or other error — try next highest bidder
        console.warn(`bidder ${bidderId} could not finalize ${price}: ${err.message}`)
        continue
      }
    }

    // If no bidder could pay, resolvedWinner stays null; finalPrice can be null
    post.closed = true
    post.winner = resolvedWinner
    post.finalPrice = resolvedPrice
    await post.save()

    results.push({ postId: post.id, winner: resolvedWinner, finalPrice: resolvedPrice })
  }
  return results
}
