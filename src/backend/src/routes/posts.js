import {
  listAllPosts,
  listPostsByAuthor,
  listPostsByTag,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  placeBid,
} from '../services/post.js'
import { requireAuth } from '../middleware/jwt.js'
import { upload } from '../middleware/upload.js'

export function postsRoutes(app) {
  app.get('/api/v1/posts', async (req, res) => {
    const { sortBy, sortOrder, author, tag, id } = req.query
    const options = { sortBy, sortOrder }
    try {
      if (id) {
        const post = await getPostById(id)
        return res.json(post ? [post] : [])
      } else if (author && tag) {
        return res
          .status(400)
          .json({ error: 'query either author or tag, not both' })
      } else if (author) {
        return res.json(await listPostsByAuthor(author, options))
      } else if (tag) {
        return res.json(await listPostsByTag(tag, options))
      } else {
        return res.json(await listAllPosts(options))
      }
    } catch (err) {
      console.error('error listing posts ', err)
      return res.status(500).end()
    }
  })
  app.get('/api/v1/posts/:id', async (req, res) => {
    const { id } = req.params
    try {
      const post = await getPostById(id)
      if (post == null) return res.status(404).end()
      return res.json(post)
    } catch (err) {
      console.error('error getting post, ', err)
      return res.status(500).end()
    }
  })
  //this post will also include up to one image.
  // The image is currently optional, but that can be changed elsewhere
  app.post(
    '/api/v1/posts/',
    requireAuth,
    upload.single('image'),
    async (req, res) => {
      try {
        const image = req.file ? `/uploads/${req.file.filename}` : null

        const post = await createPost(req.auth.sub, {
          ...req.body,
          image, // pass image path to service
        })

        return res.json(post)
      } catch (err) {
        console.error('error creating post ', err)
        return res
          .status(500)
          .json({ error: err.message || 'Internal Server Error' })
      }
    },
  )

  app.patch('/api/v1/posts/:id', requireAuth, async (req, res) => {
    try {
      const post = await updatePost(req.auth.sub, req.params.id, req.body)
      return res.json(post)
    } catch (err) {
      console.error('Error updating post, ', err)
      return res.status(500).end()
    }
  })
  app.delete('/api/v1/posts/:id', requireAuth, async (req, res) => {
    try {
      const { deletedCount } = await deletePost(req.auth.sub, req.params.id)
      if (deletedCount === 0) return res.sendStatus(404)
      return res.status(204).end()
    } catch (err) {
      console.error('error deleting post, ', err)
      return res.status(500).end()
    }
  })

  app.post('/api/v1/posts/:id/bid', requireAuth, async (req, res) => {
    try {
      const { amount } = req.body
      if (!amount || isNaN(amount)) {
        return res.status(400).json({ error: 'Valid bid amount is required' })
      }
      const post = await placeBid(req.auth.sub, req.params.id, Number(amount))
      return res.json(post)
    } catch (err) {
      console.error('error placing bid, ', err)
      return res.status(400).json({ error: err.message })
    }
  })
}
