export const signup = async ({username, password}) => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}user/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ username, password })
    })
    if (!res.ok) throw new Error('failed to sign up')
    return await res.json()
}

export const login = async ({username, password}) => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ username, password })
    })
    if (!res.ok) throw new Error('failed to log in')
    return await res.json()
}

export const getUserInfo = async (id) => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}users/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json'},

    })
    return await res.json()
}

export const addTokens = async (amount, token) => {
    if (!token) {
        throw new Error('not authenticated')
    }

    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}user/tokens`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ amount })
    })
    if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'failed to add tokens')
    }
    return await res.json()
}