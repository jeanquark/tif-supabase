import Link from 'next/link'

export default function Form() {
    const registerUser = async event => {
        event.preventDefault() // prevents page from redirecting on form submissiomn

        // call default function in pages/api/register
        // send the email and password from form submission event to that endpoint
        const res = await fetch("/api/register", {
            body: JSON.stringify({
                email: event.target.email.value,
                password: event.target.password.value,
            }),
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
        })

        const result = await res.json()
        console.log('result: ', result)
    }

    return (
        <>
            <Link href="/">
                <a>&larr; Home</a>
            </Link>
            <h3>Register</h3>
            <form onSubmit={registerUser}>
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                />
                <label htmlFor="password">Password</label>

                <input
                    type="password"
                    id="password"
                    name="password"
                    required
                />
                <button type="submit">Register</button>
            </form>
        </>
    )
}