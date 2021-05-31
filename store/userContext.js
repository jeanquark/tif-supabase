import { createContext, useState, useEffect } from 'react'

const UserContext = createContext({
    user: {}
});

export function UserContextProvider(props) {
    const [user, setUser] = useState(null);

    useEffect(async () => {
        console.log('[userContext] useEffect userContextProvider')
        setUserHandler()
    }, [])

    async function setUserHandler() {
        console.log('[userContext] setUserHandler')
        const { supabase } = props
        const session = supabase.auth.session()
        const authUser = session?.user
        console.log('[userContext] authUser: ', authUser)
        if (authUser) {
            const { data, error } = await supabase.from('users').select('*').eq('auth_user_id', authUser.id)
            if (error) {
                console.log('error: ', error)
                return
            }
            // console.log('[userContext] data: ', data)
            setUser(data[0])
            supabase
                .from(`users:auth_user_id=eq.${authUser.id}`)
                .on('*', (payload) => {
                    console.log('[userContext] User data change received!', payload)
                    setUser(payload.new)
                })
                .subscribe()
        }
    }

    const context = {
        user,
        setUser: setUserHandler
        // user: {
        //     email: 'jm.kleger@ik.me',
        //     firstname: 'Jean-Marc',
        //     points: 10
        // }
    };

    return (
        <UserContext.Provider value={context}>
            {props.children}
        </UserContext.Provider>
    );
}

export default UserContext;