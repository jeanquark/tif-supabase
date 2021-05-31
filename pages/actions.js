import { useState, useEffect } from 'react'
import { supabase } from '../lib/initSupabase'
import Head from 'next/head'
import Link from 'next/link'
import { makeStyles } from '@material-ui/core/styles'
import { Container, Box, Paper } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Navbar from '../components/Navbar'

const useStyles = makeStyles((theme) => ({
    container: {
        paddingLeft: theme.spacing(5),
        paddingRight: theme.spacing(5),
    },
}))

export default function Actions() {
    const classes = useStyles()
    const [error, setError] = useState('')
    const [actions, setActions] = useState([])
    const [newAction, setNewAction] = useState('')
    let mySubscription = null

    const getInitialActions = async () => {
        if (!actions.length) {
            const { data, error } = await supabase.from(`event_actions`).select(`id, events (home_team_name, visitor_team_name), actions (name), users (id, full_name)`).eq('event_id', 4).order('id', { ascending: true })
            if (error) {
                setError(error.message)
                supabase.removeSubscription(mySubscription)
                mySubscription = null
                return
            }
            setActions(data)
        }
    }
    const getActionsAndSubscribe = async () => {
        setError('')
        getInitialActions()
        console.log('getMessagesAndSubscribe')
        if (!mySubscription) {
            // mySubscription = supabase
            //     .from(`event_actions`)
            //     .on('*', (payload) => {
            //         console.log('getActionsAndSubscribe payload: ', payload)
            //         setNewAction(payload.new)
            //     })
            //     .subscribe()
        } else {
            console.log('Delete action')
        }
    }

    function joinAction (actionId) {
        console.log('joinAction: ', actionId)
    }

    useEffect(() => {
        console.log('useEffect ran!')
        getActionsAndSubscribe()
        return () => {
            supabase.removeSubscription()
            console.log('Remove supabase subscription by useEffect unmount')
        }
    })

    useEffect(() => {
        if (newAction) {
            console.log('newAction: ', newAction)
            setActions((m) => [...m, newAction])
        }
    }, [newAction])

    return (
        <>
            <Head>
                <title>Actions for Event id=4</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Navbar title={'Actions'} links={['fixtures', 'test']} />

            <Container className={classes.container}>
                {actions.map((action) => (
                    <Box key={action.id}>
                        <Paper elevation={3} style={{ margin: 10, padding: 8 }}>
                            Action <i>{action.actions?.name}</i> on event <i>{action.events?.home_team_name} - {action.events?.visitor_team_name}</i> by user <i>{actions.users?.full_name}</i> <button onClick={() => joinAction(action.id)}>Participate</button>
                        </Paper>
                    </Box>
                ))}
            </Container>
        </>
    )
}
