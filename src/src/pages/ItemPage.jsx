import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { getPosts } from '../api/posts.js'
import { Header } from '../components/Header.jsx'
import { Post } from '../components/Post.jsx'

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
  const item = itemQuery.data || []
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
    </div>
  )
}
