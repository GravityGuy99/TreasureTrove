import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { createPost } from '../api/posts.js'
import { useAuth } from '../contexts/AuthContext.jsx'

export function CreatePost() {
  const [token] = useAuth()
  const [id, setId] = useState('')
  const [title, setTitle] = useState('')
  const [contents, setContents] = useState('')
  const [expiresAt, setExpiresAt] = useState('')
  const [bid, setBid] = useState('')
  const [image, setImage] = useState(null)
  const queryClient = useQueryClient()
  const createPostMutation = useMutation({
    mutationFn: () => {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('contents', contents)
      formData.append('expiresAt', expiresAt)
      formData.append('bid', bid)
      if (image) {
        formData.append('image', image)
      }

      return createPost(token, formData)
    },
    onSuccess: (data) => {
      // Capture the numeric id from the created post response
      setId(data.id)
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
    onError: (err) => {
      console.error('createPost failed', err)
      alert(err?.message || 'Failed to create post')
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Submitting', { title, contents, expiresAt })
    createPostMutation.mutate()
  }

  if (!token) return <div> Please log in to create new posts. </div>

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor='create-title'>Title: </label>
        <input
          type='text'
          name='create-title'
          id='create-title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <br />
      <textarea
        value={contents}
        onChange={(e) => setContents(e.target.value)}
      />
      <br />
      <div>
        <label htmlFor='post-image'>Image: </label>
        <input //Pretty simple. It accepts images files. But it only accepts 1 file
          type='file'
          id='post-image'
          accept='image/*'
          onChange={(e) => setImage(e.target.files[0])}
        />
      </div>
      <br />
      <div>
        <label htmlFor='create-bid'>Starting Bid: </label>
        <input
          type='number'
          min='1'
          step='1'
          name='create-bid'
          id='create-bid'
          value={bid}
          onChange={(e) => setBid(e.target.value)}
          required
        />
      </div>
      <br />
      <div>
        <label htmlFor='biddingEndsAt'>Bidding ends at:</label>
        <input
          type='datetime-local'
          id='biddingEndsAt'
          name='biddingEndsAt'
          value={expiresAt}
          onChange={(e) => setExpiresAt(e.target.value)}
          required
        />
      </div>

      <br />
      <input
        type='submit'
        value={createPostMutation.isPending ? 'Creating...' : 'Create'}
        disabled={!title || createPostMutation.isPending || !expiresAt || !bid}
      />
      {createPostMutation.isSuccess ? (
        <>
          <br />
          Post Created successfully!
        </>
      ) : null}
    </form>
  )
}
