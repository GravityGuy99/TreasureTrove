import { useQuery } from '@tanstack/react-query'
import { PostList } from '../components/PostList.jsx'
import { PostSorting } from '../components/PostSorting.jsx'
import { getPosts } from '../api/posts.js'
import { useState } from 'react'
import { Header } from '../components/Header.jsx'
import { User } from "../components/User.jsx";

export function UserPage() {
  const [user] = User()
  const [sortBy] = useState('createdAt')
  const postsQuery = useQuery({
    queryKey: ['posts', {user, sortBy}],
    queryFn: () => getPosts({user, sortBy}),
  })

  const posts = postsQuery.data ?? []

  return (
    <div style={{padding: 8}}>
      <Header />
      <br />
      <hr />
      <br />
      <PostSorting 
       setSortBy={ user }
      />
      <hr />
      <PostList posts={posts} />
    </div>
  )
}

