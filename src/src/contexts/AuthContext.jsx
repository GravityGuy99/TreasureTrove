import { createContext, useState, useContext, useEffect } from "react";
import PropTypes from 'prop-types'

export const AuthContext = createContext({
    token: null, 
    setToken: () => {},
})

export const AuthContextProvider = ({children}) => {
    const [token, setToken] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    // Initialize token from localStorage on mount
    useEffect(() => {
        const savedToken = localStorage.getItem('authToken')
        if (savedToken) {
            setToken(savedToken)
        }
        setIsLoading(false)
    }, [])

    // Save token to localStorage whenever it changes
    useEffect(() => {
        if (token) {
            localStorage.setItem('authToken', token)
        } else {
            localStorage.removeItem('authToken')
        }
    }, [token])

    // Don't render children until we've checked localStorage
    if (isLoading) {
        return null
    }

    return (
        <AuthContext.Provider value={{token, setToken}}>
            {children}
        </AuthContext.Provider>
    )
}

AuthContextProvider.propTypes = {
    children: PropTypes.element.isRequired,
}

export function useAuth() {
    const {token, setToken} = useContext(AuthContext)
    return [token, setToken]
}