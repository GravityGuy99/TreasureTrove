import PropTypes from 'prop-types'
import { User } from './User.jsx'

export function Bid({ amount, userId, timestamp }) {
  function formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })
  }

  return (
    <div className='bid-item'>
      <p>
        <strong>{amount}</strong> bid by <User id={userId} />
      </p>
      <p>
        <small>{formatDate(timestamp)}</small>
      </p>
    </div>
  )
}

Bid.propTypes = {
  amount: PropTypes.number.isRequired,
  userId: PropTypes.string.isRequired,
  timestamp: PropTypes.string.isRequired,
}

export const bid = {
  amount: 0,
  userId: '',
  timestamp: new Date().toISOString(),
}
