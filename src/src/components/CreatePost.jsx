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
    <form onSubmit={handleSubmit} className='create-post'>
      <div>
        <label htmlFor='create-title'>
          <h3>Title</h3>
        </label>
        <input
          type='text'
          name='create-title'
          id='create-title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <br />
      <h3>Description (Optional)</h3>
      <textarea
        value={contents}
        onChange={(e) => setContents(e.target.value)}
      />
      <br />
      <div>
        <label htmlFor='post-image'>
          <h3>Image (Optional)</h3>
        </label>
        <input //Pretty simple. It accepts images files. But it only accepts 1 file
          type='file'
          id='post-image'
          accept='image/*'
          onChange={(e) => setImage(e.target.files[0])}
        />
      </div>
      <br />
      <div>
        <label htmlFor='create-bid'>
          <h3>Starting Bid</h3>
        </label>
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
        <label htmlFor='biddingEndsAt'>
          <h3>Bidding ends</h3>
        </label>
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
        className='make-post'
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
