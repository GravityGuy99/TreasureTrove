import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { User } from './User.jsx'
import { useState, useEffect } from 'react'

export function Post({ title, contents, author, expiresAt, bid, image, id }) {
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
          <p>Current bid: {bid}</p>
        </div>
        <em>
          <br />
          Posted by <User id={author} />
          <p>Time remaining: {timeLeft}</p>
        </em>
        <div>
          <Link to={`/item/${id}`}>View Item</Link>
        </div>
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
}
