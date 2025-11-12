import { PostList } from '../components/PostList.jsx'
import { getPosts } from '../api/posts.js'
import { Header } from '../components/Header.jsx'
import { useParams } from 'react-router-dom';

  

export function ItemPage() {
  const { id } = useParams(); // Accesses the 'id' parameter from the URL
  const post = getPosts(id); // Hypothetical function to get post by ID
  
  return (
    <div style={{padding: 0}}>
      <Header />
      <hr />
      <br />
      <br />
      <PostList post={[post]} />
    </div>
  )
}

