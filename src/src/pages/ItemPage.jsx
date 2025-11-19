import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { getPosts } from '../api/posts.js'
import { Header } from '../components/Header.jsx'
import { Post } from '../components/Post.jsx'


export function ItemPage() {
  //Grabs ID from the URL
  const { itemId } = useParams()

  //Fetches the item data based on the ID
  const itemQuery = useQuery({
    queryKey: ['posts', itemId],
    queryFn: () => getPosts({ id: itemId }),
  })

  const item = itemQuery.data

  //Shows a loading message while fetching
  if (itemQuery.isLoading) {
    return (
      <div>
        <Header />
        <p>Loading item...</p>
      </div>
    )
  }

  //Shows an error if there is an error fetching the item
  if (itemQuery.isError) {
    return (
      <div>
        <Header />
        <p>Error loading item</p>
      </div>
    )
  }

  //Shows an error if item does not exist
  if (!item) {
    return (
      <div>
        <Header />
        <p>Item not found</p>
      </div>
    )
  }
  //Shows the item details
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

