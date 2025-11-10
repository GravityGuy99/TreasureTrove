import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from 'react'
import { createPost } from "../api/posts.js"
import { useAuth } from "../contexts/AuthContext.jsx"

export function CreatePost() {
    const [token] = useAuth()
    const [title, setTitle] = useState('')
    const [contents, setContents] = useState('')
    const [expiresAt, setExpiresAt] = useState('')  
    const queryClient = useQueryClient()
    const createPostMutation = useMutation({
        mutationFn: () => createPost(token, {title, contents, expiresAt}),
        onSuccess: () => queryClient.invalidateQueries({queryKey: ["posts"]}),
        onError: (err) => {
            console.error('createPost failed', err)
            alert(err?.message || 'Failed to create post')
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("Submitting", {title, contents, expiresAt})
        createPostMutation.mutate()
    }

    if(!token) return <div> Please log in to create new posts. </div>
    
    return(
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="create-title">Title: </label>
                <input 
                    type="text" 
                    name="create-title" 
                    id="create-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <br />
            <textarea 
                value={contents}
                onChange={(e) => setContents(e.target.value)}
            />
            <br />
            
            <div>
                <label htmlFor="biddingEndsAt">Bidding ends at:</label>
                <input
                type="datetime-local"
                id="biddingEndsAt"
                name="biddingEndsAt"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                required
                />
            </div>

            <br />
            <input 
                type="submit" 
                value={createPostMutation.isPending ? 'Creating...' : "Create"}
                disabled={!title || createPostMutation.isPending || !expiresAt}
            />
            {createPostMutation.isSuccess ? (
                <>
                    <br />
                    Post Created successfully!
                </>
            ): null}
        </form>
    )
}