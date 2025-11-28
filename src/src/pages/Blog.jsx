import { PostList } from '../components/PostList.jsx'
import { PostFilter } from '../components/PostFilter.jsx'
import { PostSorting } from '../components/PostSorting.jsx'
import { getPosts } from '../api/posts.js'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Header } from '../components/Header.jsx'
import { LoginCheck } from '../components/LoginCheck.jsx'

export function Blog(){
  const [author, setAuthor] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('descending')
  const postsQuery = useQuery({
    queryKey: ['posts', {author, sortBy, sortOrder}],
    queryFn: () => getPosts({author, sortBy, sortOrder}),
  })

  const posts = postsQuery.data ?? []

  return (
    <div style={{padding: 0}}>
        <Header />
        <hr />
        <br />
        <LoginCheck />
        <br />
        <div style={{paddingLeft: '8px'}}>
          Filter By:
          <PostFilter 
            field='author' 
            value={author}
            onChange={(value) => setAuthor(value)}
            />
          <br />
            <PostSorting
              fields={['createdAt', 'updatedAt']}
              value={sortBy}
              onChange={(value) => setSortBy(value)}
              orderValue={sortOrder}
              onOrderChange={(orderValue) => setSortOrder(orderValue)}
            />
        </div>
        <br />
        <hr />
        <h2 style={{ textAlign: "center" }}>Listings</h2>
        <br />
        <PostList posts={posts} />
    </div>
  )
}

