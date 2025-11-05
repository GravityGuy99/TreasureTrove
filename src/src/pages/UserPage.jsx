import { useQuery } from '@tanstack/react-query'
import { PostList } from '../components/PostList.jsx'
import { PostSorting } from '../components/PostSorting.jsx'
import { getPosts } from '../api/posts.js'
import { useState } from 'react'
import { Header } from '../components/Header.jsx'
import { useUser } from '../components/GetUser.jsx'


export function UserPage() {
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('descending')
  const userId = useUser()

  const postsQuery = useQuery({
    queryKey: ['posts', {author: userId, sortBy, sortOrder}],
    queryFn: () => getPosts({author: userId, sortBy, sortOrder}),
  })

  const posts = postsQuery.data ?? []

  return (
    <div style={{padding: 0}}>
      <Header />
      <hr />
      <br />
      <br />
      <PostSorting
        fields={["createdAt", "title"]}
        value={sortBy}
        onChange={setSortBy}
        orderValue={sortOrder}
        onOrderChange={setSortOrder}
      />
      <span> Here is where you can sort the listings you have made, once listings are created!</span>
      <hr />
      <PostList posts={posts} />
    </div>
  )
}

