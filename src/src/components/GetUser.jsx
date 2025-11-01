import { useAuth } from "../contexts/AuthContext.jsx"
import {jwtDecode} from 'jwt-decode'

// Custom hook to get the logged-in user's id (sub) from the JWT stored in context.
// Use inside React components only, e.g. `const userId = useUser()`
export function useUser() {
    const [token] = useAuth()
    if (!token) return null
    try {
        const { sub } = jwtDecode(token)
        return sub
    } catch (err) {
        // invalid token
        return null
    }
}