import {Link } from "react-router-dom";

export function SpecialPage() {

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