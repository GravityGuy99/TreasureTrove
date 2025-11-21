import { useQuery, useQueryClient } from '@tanstack/react-query'
import { PostList } from '../components/PostList.jsx'
import { PostSorting } from '../components/PostSorting.jsx'
import { getPosts } from '../api/posts.js'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext.jsx'
import { getUserInfo, addTokens } from '../api/users.js'
import { Header } from '../components/Header.jsx'
import { useUser } from '../components/GetUser.jsx'
import { useNavigate } from "react-router-dom";


export function UserPage() {
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('descending')
  const userId = useUser()
  // need auth to add tokens
  const [token] = useAuth()
  const queryClient = useQueryClient()
  const ADD_AMOUNT = 1000 // hardcoded amount to add when user clicks the button

  const navigate = useNavigate()
  const promptedRef = useRef(false)

  useEffect(() => {
    // If there's no token, show a confirm popup once; on OK navigate to login
    if (!token && !promptedRef.current) {
      promptedRef.current = true
      const ok = window.confirm('You must be logged in to view this page. Click OK to go to the login page.')
      if (ok) navigate('/login', { replace: true })
    }
  }, [token, navigate])

  const userInfoQuery = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserInfo(userId),
    enabled: !!userId,
  })

  const userInfo = userInfoQuery.data ?? { username: '', tokens: 0 }

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
      <hr />
      <div style={{padding: '8px'}}>
        <h3>Account</h3>
        <div>Username: {userInfo.username}</div>
        <div>Tokens: {userInfo.tokens ?? 0}</div>
        <div style={{marginTop: '8px'}}>
          <button
            onClick={async () => {
              try {
                await addTokens(ADD_AMOUNT, token)
                // refresh user info
                queryClient.invalidateQueries(['user', userId])
              } catch (err) {
                console.error('failed to add tokens', err)
              }
            }}
            disabled={!token}
          >
            + Add {ADD_AMOUNT} tokens
          </button>
          {!token && <div style={{color: '#888', marginTop: '6px'}}>Log in to add tokens</div>}
        </div>
      </div>
      <hr />
      <PostSorting
        fields={["createdAt", "title"]}
        value={sortBy}
        onChange={setSortBy}
        orderValue={sortOrder}
        onOrderChange={setSortOrder}
      />
      <hr />
      <PostList posts={posts} />
    </div>
  )
}

