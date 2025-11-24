import { useAuth } from "../contexts/AuthContext.jsx"

export function LoginCheck() {
    const [token] = useAuth()
    //if the user does not have a proper token, it tells them to sign in
    if(!token) {
        return (<div>Please sign in to list an item. <br /><hr /></div>)
    }
    
    return( 
        //tells the user that they can now go to the create post page
        //includes a link to said page
        <div>
            <button onClick={() => window.location.href = `/createpost`} style={{ marginLeft: '12px' }}> List Item </button>
            <br />
            <hr />
            <br />
        </div>

    )
}