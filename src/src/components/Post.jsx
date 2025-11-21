import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { User } from './User.jsx'

export function Post({ title, contents, author, expiresAt, bid, image, id }) {
  //I got this code from ChatGPT, but I can explain how it works
  //it takes the createdAt data that we created previously and converts it into time that is easy to read by humans
  //using 'short' for dateStyle makes it display the day like mm/dd/yyyy  instead of month dd yyyy
  //using 'short' for timeStyle makes it display the time of day hr:min instead of hr:min:sec
  function formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })
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
            <p>Bidding ends at: {formatDate(expiresAt)}</p>
          </em>
        </div>
        <br />
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
