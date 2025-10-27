import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../contexts/AuthContext.jsx";
import { User } from "./User.jsx";

export function Header() {
    const [token, setToken] = useAuth()
    if (token) {
        const {sub} = jwtDecode(token)
        return (
            <div style={{
                background: '#3C78D8',
                padding: '15px 30px',
                textAlign: 'left',
                color: '#3C78D8'
            }}>
                 <span>Logged in as <User id ={sub} /></span>
                <br />
                <button onClick={() => setToken(null)}>Logout</button>
            </div>
        )
    }

    return (
        <div style={{
            background: '#3C78D8',
            padding: '15px 30px',
            textAlign: 'left',
            display: 'flex',
            justifyContent: 'space-between',
            color: '#3C78D8'
        }}>
            <Link to='/'>Home Page</Link> | <div style={{ textAlign:'right'}}><Link to='/login'>Login</Link> | <Link to='/signup'>Signup</Link></div>
        </div>
    )
}