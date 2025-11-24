import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { User } from './User.jsx'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { placeBid } from '../api/posts.js'
import { useAuth } from '../contexts/AuthContext.jsx'

export function Post({
  title,
  contents,
  author,
  expiresAt,
  bid,
  image,
  id,
  bids = [],
}) {
  const [token] = useAuth()
  const [bidAmount, setBidAmount] = useState('')
  const queryClient = useQueryClient()

  //I got this code from ChatGPT, but I can explain how it works
  //it takes the createdAt data that we created previously and converts it into time that is easy to read by humans
  //using 'short' for dateStyle makes it display the day like mm/dd/yyyy  instead of month dd yyyy
  //using 'short' for timeStyle makes it display the time of day hr:min instead of hr:min:sec
  function formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })
  }
  const currentBid =
    bids.length > 0
      ? Math.max(...bids.map((b) => Number(b.amount)))
      : Number(bid || 0)

  const placeBidMutation = useMutation({
    mutationFn: () => placeBid(token, id, Number(bidAmount)),
    onSuccess: () => {
      setBidAmount('')
      queryClient.invalidateQueries({ queryKey: ['posts', String(id)] })
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
    onError: (err) => {
      console.error('placeBid failed', err)
      alert(err?.message || 'Failed to place bid')
    },
  })

  const handleBidSubmit = (e) => {
    e.preventDefault()
    const newBid = Number(bidAmount)
    if (newBid <= currentBid) {
      alert(`Bid must be higher than current bid of ${currentBid}`)
      return
    }
    placeBidMutation.mutate()
  }

  return (
    <article>
      <div className='listing-card'>
        <h3>{title}</h3>
        {image && (
          <div>
            <img
              src={`http://localhost:3001${image}`} //the image is added here
              alt={title}
              style={{ maxWidth: '200px', height: 'auto' }}
            />
          </div>
        )}
        <div>{contents}</div>
        <div>
          <p>Current bid: {currentBid}</p>
        </div>
        <em>
          <br />
          Posted by <User id={author} />
          <p>Bidding ends at: {formatDate(expiresAt)}</p>
        </em>
        <div>
          <Link to={`/item/${id}`}>View Item</Link>
        </div>

        {token && (
          <form onSubmit={handleBidSubmit} className='bid-form'>
            <div>
              <label htmlFor={`bid-amount-${id}`}>
                <h4>Place Your Bid</h4>
              </label>
              <input
                type='number'
                id={`bid-amount-${id}`}
                min={currentBid + 1}
                step='1'
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder={`Minimum: ${currentBid + 1}`}
                required
              />
              <button
                type='submit'
                disabled={!bidAmount || placeBidMutation.isPending}
              >
                {placeBidMutation.isPending ? 'Placing Bid...' : 'Place Bid'}
              </button>
            </div>
          </form>
        )}
      </div>
    </article>
  )
}

Post.propTypes = {
  title: PropTypes.string.isRequired,
  contents: PropTypes.string,
  author: PropTypes.string,
  expiresAt: PropTypes.string,
  bid: PropTypes.number.isRequired,
  image: PropTypes.string,
  id: PropTypes.number,
  bids: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.number.isRequired,
      userId: PropTypes.string.isRequired,
      timestamp: PropTypes.string.isRequired,
    }),
  ),
}
