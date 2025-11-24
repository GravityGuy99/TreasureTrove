export const getPosts = async (queryParams) => {
  try {
    console.log('Backend URL: ', import.meta.env.VITE_BACKEND_URL)
    const url = new URL('posts', import.meta.env.VITE_BACKEND_URL)

    Object.entries(queryParams).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v)
    })

    const res = await fetch(url.toString())
    return await res.json()
  } catch (err) {
    console.error('error fetching posts: ', err)
    return []
  }
}

export const createPost = async (token, formData) => {
  //pretty similar to what it was before, but now it made for multer
  try {
    const url = new URL('posts', import.meta.env.VITE_BACKEND_URL)

    const res = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    return await res.json()
  } catch (err) {
    console.error('Error creating posts: ', err)
  }
}

export const placeBid = async (token, postId, amount) => {
  //Basically the way the user set the price, plus saving the bid in a seperate location
  try {
    const url = new URL(`posts/${postId}/bid`, import.meta.env.VITE_BACKEND_URL)

    const res = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount }),
    })

    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData.error || 'Failed to place bid')
    }

    return await res.json()
  } catch (err) {
    console.error('Error placing bid: ', err)
    throw err
  }
}
