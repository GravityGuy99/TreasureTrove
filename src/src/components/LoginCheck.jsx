import { useAuth } from "../contexts/AuthContext.jsx"
import {  Link } from "react-router-dom";

export function LoginCheck() {
    const [token] = useAuth()
    //if the user does not have a proper token, it tells them to sign in
    if(!token) return(
        <div> 
            <p>Please log in to view the special page.</p>
            <hr />
        </div>
        
    )
    return( 
        //tells the user that they can now go to the special page
        //includes a link to said page
        <div id="non-header-link">
            <Link to='/specialpage'>You can now go to the special page!</Link>
            <hr />
        </div>

    )
}