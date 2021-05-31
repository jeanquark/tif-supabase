import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/initSupabase'
import Head from 'next/head'
import { Auth } from '@supabase/ui'
import { makeStyles } from '@material-ui/core/styles'
import Link from 'next/link'
import EventDetails from '../../components/EventDetails'
import MessageList from '../../components/MessageList'
import ActionList from '../../components/ActionList'
import Navbar from '../../components/Navbar'
import { Container, Grid, AppBar, Toolbar, Box, Button, Typography, IconButton, Menu, MenuItem } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    link: {
        color: 'red',
        textDecoration: 'none',
    },
    toolbar: theme.mixins.toolbar,
}))

const Event = () => {
    const router = useRouter()
    const { id } = router.query
    const classes = useStyles()
    const { user, session } = Auth.useUser()
    const [event, setEvent] = useState([])
    // const [error, setError] = useState('')
    // let mySubscription = null

    // useEffect(() => {
    //     console.log('[useEffect] id: ', id)
    //     if (id != undefined) {
    //         getActionsAndSubscribe(id)
    //     }
    //     return async () => {
    //         const { data } = await supabase.removeSubscription(mySubscription)
    //         // Remove user from event
    //         await supabase
    //             .from('user_event')
    //             .upsert(
    //                 { user_id: 1, event_id: null },
    //                 { onConflict: 'user_id' }
    //             )
    //         console.log('Remove supabase subscription by useEffect unmount. data: ', data)

    //     }
    // }, [id])

    // const getInitialActions = async (id) => {
    //     console.log('getInitialActions')
    //     if (!actions.length) {
    //         const { data, error } = await supabase
    //             .from(`event_actions`)
    //             .select(`id, number_participants, participation_threshold, is_completed, expired_at, events (home_team_name, visitor_team_name), actions (name), users (id, full_name)`)
    //             .eq('event_id', id)
    //             .order('id', { ascending: true })
    //         if (error) {
    //             setError(error.message)
    //             supabase.removeSubscription(mySubscription)
    //             mySubscription = null
    //             return
    //         }
    //         setActions(data)

    //         // Add user to event
    //         await supabase
    //             .from('user_event')
    //             .upsert(
    //                 { user_id: 1, event_id: id },
    //                 { onConflict: 'user_id' }
    //             )
    //     }
    // }

    // const getActionsAndSubscribe = async (id) => {
    //     console.log('getActionsAndSubscribe')
    //     setError('')
    //     getInitialActions(id)
    //     if (!mySubscription) {
    //         mySubscription = supabase
    //             .from(`event_actions:event_id=eq.${id}`)
    //             .on('INSERT', (payload) => {
    //                 console.log('INSERT')
    //                 handleNewAction(payload.new)
    //                 // handleCreateAction(payload.new)
    //             })
    //             .on('UPDATE', (payload) => {
    //                 console.log('UPDATE')
    //                 handleUpdateAction(payload.new)
    //             })
    //             .subscribe()
    //     } else {
    //         supabase.removeSubscription(mySubscription)
    //         console.log('Delete message')
    //     }
    // }

    // useEffect(() => {
    // 	console.log('useEffect user.id: ', user?.id)
    // 	if (user) {
    // 		console.log('Redirect to /fixtures')
    // 	}
    // }, [])

    // useEffect(() => {
    //     fetchEvent(id)
    // }, [id])

    // const fetchEvent = async (id) => {
    //     let { data: event, error } = await supabase.from('events').select('*').eq('id', id)
    //     if (error) {
    //         console.log('error', error)
    //     } else {
    //         console.log('event[0]: ', event[0])
    //         setEvent(event[0])
    //     }
    // }

    return (
        <div className={classes.root}>
            <Head>
                <title>Euro 2020</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Navbar />

            <main className={classes.content}>
                <div className={classes.appBarSpacer} />
                <Container maxWidth="lg" className={classes.container}>
                    <Grid container spacing={0}>
                        <Grid item xs={12} sm={6}>
                            {/* <EventDetails /> */}
                            user.role: {user?.role}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            {/* <MessageList /> */}
                            <ActionList />
                        </Grid>
                    </Grid>
                </Container>
            </main>
        </div>
    )
}

export default Event
