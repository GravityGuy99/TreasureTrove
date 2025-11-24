import { useQuery } from '@tanstack/react-query'
import { PostList } from '../components/PostList.jsx'
import { PostSorting } from '../components/PostSorting.jsx'
import { getPosts } from '../api/posts.js'
import { getUserInfo } from '../api/users.js'
import { useState } from 'react'
import { Header } from '../components/Header.jsx'
import { useParams } from 'react-router-dom'

export function UserPage() {
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('descending')
  const { userId } = useParams()

  // First, get the username from the userId
  const userQuery = useQuery({
    queryKey: ['users', userId],
    queryFn: () => getUserInfo(userId),
  })

  const username = userQuery.data?.username

  // Then query posts by username
  const postsQuery = useQuery({
    queryKey: ['posts', { author: username, sortBy, sortOrder }],
    queryFn: () => getPosts({ author: username, sortBy, sortOrder }),
    enabled: !!username, // Only run when we have a username
  })

  const posts = postsQuery.data ?? []

  return (
    <div style={{ padding: 0 }}>
      <Header />
      <hr />
      <br />
      <br />
      <PostSorting
        fields={['createdAt', 'title']}
        value={sortBy}
        onChange={setSortBy}
        orderValue={sortOrder}
        onOrderChange={setSortOrder}
      />
      <span>
        {' '}
        Here is where you can sort the listings you have made, once listings are
        created!
      </span>
      <hr />
      <PostList posts={posts} />
    </div>
  )
}
