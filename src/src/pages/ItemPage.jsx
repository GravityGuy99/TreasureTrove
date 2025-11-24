import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { getPosts } from '../api/posts.js'
import { Header } from '../components/Header.jsx'
import { Post } from '../components/Post.jsx'
import { Bid } from '../components/Bids.jsx'

export function ItemPage() {
  //grab itemId from the url params
  const { itemId } = useParams()

  // Fetches the item data based on the ID
  const itemQuery = useQuery({
    queryKey: ['posts', itemId],
    queryFn: () => getPosts({ id: itemId }),
  })

  //Shows a loading message while fetching
  if (itemQuery.isLoading) {
    return (
      <div>
        <Header />
        <p>Loading item...</p>
      </div>
    )
  }

  //Take the actual item
  const item = itemQuery.data?.[0]
  //Shows an error if there is an error fetching the item
  if (itemQuery.isError) {
    return (
      <div>
        <Header />
        <p>Error loading item.</p>
      </div>
    )
  }

  //Shows an error if item does not exist
  if (!item) {
    return (
      <div>
        <Header />
        <p>Item not found.</p>
      </div>
    )
  }

  //Show the item details
  return (
    <div style={{ padding: 0 }}>
      <Header />
      <hr />
      <br />
      <Post {...item} />
      <hr />
      <div className='bids-list' style={{ padding: '20px' }}>
        <h3>Bid History</h3>
        {item.bids && item.bids.length > 0 ? (
          item.bids.map((bid, idx) => (
            <Bid
              key={idx}
              amount={bid.amount}
              userId={bid.userId}
              timestamp={bid.timestamp}
            />
          ))
        ) : (
          <p>No bids yet.</p>
        )}
      </div>
    </div>
  )
}
