import { useAuth } from "../contexts/AuthContext.jsx";
import { Navigate } from "react-router-dom";
import { Header } from '../components/Header.jsx'
import { CreatePost } from '../components/CreatePost.jsx'

export function SpecialPage() {

  const [token] = useAuth()
    //if the user is not logged in, redirect to login page
    if(!token) {
      return(<Navigate to="/login" replace={true} />)
    }
    
  //can send user back to main page
  //also announces you are in the special page
  //this page is very simple
  return (
    <div style={{padding: 0}}>
      <Header />
      <hr />
      <br />
      <CreatePost />
    </div>
  )
}