import { useRouter } from 'next/router'
import Link from 'next/link'
import { supabase } from "../lib/initSupabase";

export default function Form() {
    const router = useRouter()
    const signInUser = async (event) => {
        try {
            console.log('signInUser: ', event)
            event.preventDefault()

            const res = await fetch(`/api/login`, {
                body: JSON.stringify({
                    email: event.target.email.value,
                    password: event.target.password.value,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
            })

            const { user } = await res.json()
            if (user) router.push(`/protected`)
        } catch (error) {
            console.log('error: ', error)
            // alert('Error')
        }
    }
    async function googleOAuthHandler() {
        console.log('googleOAuthHandler')
        // https://<your-ref>.supabase.co/auth/v1/authorize?provider=google&redirect_to=http://localhost:3000/welcome
        const { user, session, error } = await supabase.auth.signIn({
            provider: 'google',
        })
		console.log('user: ', user)
		console.log('session: ', session)
		console.log('error: ', error)
    }

    return (
        <>
            <Link href="/">
                <a>&larr; Home</a>
            </Link>
            <h3>Login</h3>
            <form onSubmit={signInUser}>
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" autoComplete="email" required />
                <label htmlFor="password">Password</label>

                <input type="password" id="password" name="password" required />
                <button type="submit">Login</button>
            </form>
            <button onClick={googleOAuthHandler}>Google OAuth</button>
        </>
    )
}
