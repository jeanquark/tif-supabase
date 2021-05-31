import Link from 'next/link'
import { supabase } from '../lib/initSupabase'

export default function Profile({ user }) {
    return (
        <div>
            User data retrieved server-side (from Cookie in getServerSideProps):
            <pre>{JSON.stringify(user, null, 2)}</pre>
        </div>
    )
}

export async function getServerSideProps({ req }) {
    console.log('getServerSideProps req: ', req)
    const { user } = await supabase.auth.api.getUserByCookie(req)

    if (!user) {
        // If no user, redirect to index.
        return { props: {}, redirect: { destination: '/', permanent: false } }
    }

    // If there is a user, return it.
    return { props: { user } }
}
