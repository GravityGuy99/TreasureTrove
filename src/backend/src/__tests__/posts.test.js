import mongoose from 'mongoose'
import {describe, expect, test, beforeEach} from '@jest/globals'
import {createPost, 
        listAllPosts, 
        listPostsByAuthor, 
        listPostsByTag, 
        getPostById,
        deletePost,
        updatePost
    } from '../services/post.js' 
import {Post} from '../db/models/post.js'

describe('creating posts', () => {
    test('with all parameters should succeed', async () => {
        const post =  {
            title: 'Hello Mongoose!',
            author: 'Daniel Bugl',
            contents: 'This post is stored in a MongoDB database using Mongoose.', 
            tags: ['mongoose', 'mongodb']
        }
        const createdPost = await createPost(post)
        expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId)
        const foundPost = await Post.findById(createdPost._id)
        expect(foundPost).toEqual(expect.objectContaining(post))
        expect(foundPost.createdAt).toBeInstanceOf(Date)
        expect(foundPost.updatedAt).toBeInstanceOf(Date)
    })
    test('without title should fail', async () => {
        const post = {
            author: 'Daniel Bugl',
            contents: 'Post with no title', 
            tags: ['empty'],
        }
        
        try {
            await createPost(post)
        } catch (err) {
            expect(err).toBeInstanceOf(mongoose.Error.ValidationError) 
            expect(err.message).toContain('`title` is required')
        }
    })
    test('with minimal parameters should succeed', async () => { 
        const post = {
            title: 'Only a title'
        }
        const createdPost = await createPost(post)
        expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId)
    })
})

const samplePosts = [
    {title: 'Learning Redux', author: 'Daniel Bugl', tags: ['redux']}, {title: 'Learn React Hooks', author: 'Daniel Bugl', tags: ['react']},
    {title: 'Full-Stack React Projects', author: 'Daniel Bugl', tags: ['react', 'nodejs']},
    {title: "Guide to TypeScript"},
]

let createdSamplePosts = []

beforeEach(async () => {
    await Post.deleteMany({})
    createdSamplePosts = []
    for (const post of samplePosts) {
        const createdPost = new Post (post)
        createdSamplePosts.push(await createdPost.save())
    }
})


describe('listing posts', () => {
    test('should return all posts', async () => {
        const posts = await listAllPosts()
        expect(posts.length).toEqual(createdSamplePosts.length)
    })

    test('should return posts sorted by creation date descending by default', async () => { 
        const posts = await listAllPosts()
        const sortedSamplePosts = createdSamplePosts.sort((a, b) => b.createdAt - a.createdAt)
        expect(posts.map((post) => post.createdAt)).toEqual(sortedSamplePosts.map((post) => post.createdAt),)
    })

    test('should take into account provided sorting options', async () => {
        const posts = await listAllPosts({
            sortBy: 'updatedAt',
            sortOrder: 'ascending',
        })
        const sortedSamplePosts =  createdSamplePosts.sort((a, b) => a.updatedAt - b.updatedAt)
        expect(posts.map((post) => post.updatedAt)).toEqual(sortedSamplePosts.map((post) => post.updatedAt),)
    })
    
    test('should be able to filter posts by author', async () => { 
        const posts = await listPostsByAuthor('Daniel Bugl')
        expect(posts.length).toBe(3)
    })

    test('should be able to filter by tag', async () => {
        const posts = await listPostsByTag('nodejs')
        expect(posts.length).toBe(1)
    })

})

describe('Getting Posts', () => {
    test('should return null if no post is found', async () => {
        const result = await getPostById(null)
        expect(result).toBeNull()
    })
    test('should return Post if post is found', async () => {
        const mockPost = createdSamplePosts[1]
        const result = await getPostById(mockPost._id); 
        // Compare only fields to avoid Mongoose doc metadata mismatches 
        expect(result.title).toBe(mockPost.title); 
        expect(result.author).toBe(mockPost.author); 
        expect(result.contents).toBe(mockPost.contents); 
        expect(result.tags).toEqual(expect.arrayContaining(mockPost.tags));
    })
})

describe('updating posts', () => {
    test('should update fields and the timestamp', async () => {
        const mockPost = createdSamplePosts[1]
        const updatedPost = await updatePost(mockPost._id, {title: "Updated Title", author: "Updated Author", contents: "Updated Contents", tags: ["updated"]})

        expect(updatedPost.title).toBe("Updated Title")
        expect(updatedPost.author).toBe("Updated Author")
        expect(updatedPost.contents).toBe("Updated Contents")
        expect(updatedPost.tags).toContain("updated")
        expect(updatedPost.updatedAt.getTime()).toBeGreaterThan(mockPost.updatedAt.getTime())
    })
})

describe('deleting posts', () => {
    test('should delete post', async () => {
        const post = await Post.create({ title: 'Delete Me', author: 'Zoe', }); 
        const result = await deletePost(post._id); 
        expect(result.deletedCount).toBe(1); 
        const found = await Post.findById(post._id); 
        expect(found).toBeNull();
    })
})
