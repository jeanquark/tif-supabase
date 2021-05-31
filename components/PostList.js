import { useState, useEffect } from 'react'
import { supabase } from '../lib/initSupabase'

export default function Posts() {
    const [posts, setPosts] = useState([])
    useEffect(() => {
        fetchPosts();
    }, [])
    useEffect(() => {
            supabase
                .from("posts")
                .on("INSERT", (message) => {
                    if (message.new) {
                        console.log('message.new: ', message.new)
                        setPosts([...posts, message.new])
                        console.log('posts2: ', posts)
                    }
                })
                .subscribe();
    }, [posts, setPosts])

    const fetchPosts = async () => {
        let { data: posts, error } = await supabase.from('posts').select('*').order('id', true)
        if (error) console.log('error', error)
        else setPosts(posts)
    }
    const subscribePosts = async () => {
    }
    return (
        <div>
            <h3>PostList component</h3>
            <div>
                <ul>
                    {posts.map((post) => (
                        <li key={post.id}>{post.title}</li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

