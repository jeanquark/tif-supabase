import React, { useEffect, useState, createContext, useContext } from 'react'
import { Auth } from '@supabase/ui'

const UserContext = createContext()

export const UserWrapper = (props) => {
    const { supabaseClient } = props
    // const { user, session } = Auth.useUser()
    const [user, setUser] = useState(null)
    useEffect(async () => {
        console.log('[userContext] userWrapper ')
        const session = supabaseClient.auth.session()
        // console.log('[useEffect] userWrapper session: ', session)
        // console.log('[useEffect] userWrapper session.user.id: ', session?.user?.id)
        const authUser = session?.user
        console.log('[userContext] authUser: ', authUser)
        if (authUser) {
            const { data, error } = await supabaseClient.from('users').select('*').eq('auth_user_id', authUser.id)
            if (error) {
                console.log('error: ', error)
                return
            }
            // console.log('data: ', data)
            setUser(data[0])
            supabaseClient
                .from(`users:auth_user_id=eq.${authUser.id}`)
                .on('*', (payload) => {
                    console.log('[userContext] User data change received!', payload)
                    setUser(payload.new)
                })
                .subscribe()
        }
    }, [])
    console.log('[userContext] user: ', user)
    return <UserContext.Provider value={user} {...props} />
}

export const useUserContext = () => {
    const context = useContext(UserContext)
    if (context === undefined) {
        throw new Error(`useUserContext must be used within a UserWrapper.`)
    }
    return context
}
