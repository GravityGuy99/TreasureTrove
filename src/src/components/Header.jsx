import {jwtDecode} from "jwt-decode";
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
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <button onClick={() => window.location.href = `/`} className="header-btn"> Home </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                    <span>Logged in as <User id={sub} /></span>
                    <button onClick={() => window.location.href = `/user`} className="header-btn"> Profile </button> | 
                    <button onClick={() => setToken(null)} className="header-btn"> Logout </button>
                </div>
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
            color: 'white'
        }}>
            <button onClick={() => window.location.href = `/`} className="header-btn"> Home </button>
            <div>
                <button onClick={() => window.location.href = `/login`} className="header-btn"> Login </button> | <button onClick={() => window.location.href = `/signup`} className="header-btn"> Signup </button>
            </div>
        </div>
    )
}