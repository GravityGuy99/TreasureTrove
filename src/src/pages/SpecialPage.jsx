import {Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { Navigate } from "react-router-dom";

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
    <div>
      <br />
      <Link to='/'><p>Back to main page</p></Link> 
      <br />
      <hr />
      <br />
      <p>You are in the special page! Yay!</p>
    </div>
  )
}