import PropTypes from 'prop-types'
import { User } from './User.jsx'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { placeBid } from '../api/posts.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import { useState, useEffect } from 'react'

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
const [timeLeft, setTimeLeft] = useState('')

   // Calculate and update the countdown every second
  useEffect(() => {
    function updateCountdown() {
      //gets the current time and the value of expiresAt and takes the difference
      const now = new Date().getTime()
      const end = new Date(expiresAt).getTime()
      const diff = end - now

      if (diff <= 0) {
        setTimeLeft('Expired')
        return
      }
      //converts the difference into an easier to read format (days, hours, minutes, seconds as opposed to just milliseconds)
      const seconds = Math.floor((diff / 1000) % 60)
      const minutes = Math.floor((diff / 1000 / 60) % 60)
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      if(days > 0){
        setTimeLeft(`${days}d`)
      } else if(hours>0) {
        setTimeLeft(`${hours}h ${minutes}m`)
      } else {
        setTimeLeft(`${minutes}m ${seconds}s`)
      }
      
    }
    //This will call the function once per second. 
    updateCountdown()
    const timer = setInterval(updateCountdown, 1000)

    return () => clearInterval(timer)
  }, [expiresAt])
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
        <br />
        <div>
          <p>{contents}</p>
          <br />
          <p>Current bid: {bid}</p>
          <em>
            <br />
            Posted by <User id={author} />
            <p>Time remaining: {timeLeft}</p>
          </em>
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
        <br />
        <button onClick={() => window.location.href = `/item/${id}`} className='details-btn'> View Details </button>

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
