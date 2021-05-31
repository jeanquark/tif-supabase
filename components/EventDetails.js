import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { supabase } from '../lib/initSupabase'
import { makeStyles } from '@material-ui/core/styles'
import { Box, Paper, Avatar, Typography, NoSsr } from '@material-ui/core'
import Moment from 'react-moment'

const useStyles = makeStyles((theme) => ({
    avatar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    large: {
        width: theme.spacing(10),
        height: theme.spacing(10),
        margin: theme.spacing(1),
    },
    flag: {
        width: theme.spacing(12),
        height: theme.spacing(8)
    }
}))

export default function EventDetails() {
    const router = useRouter()
    const { id } = router.query
    const classes = useStyles()
    let mySubscription = null
    const [event, setEvent] = useState('')
    const [updateEvent, handleUpdateEvent] = useState('')
    const [error, setError] = useState('')

    useEffect(() => {
        console.log('[useEffect] id: ', id)
        if (id != undefined) {
            getEventAndSubscribe(id)
        }
        return async () => {
            const { data } = await supabase.removeSubscription(mySubscription)
            console.log('Remove supabase subscription by useEffect unmount. data: ', data)
        }
    }, [id])

    useEffect(() => {
        try {
            console.log('[useEffect] updateEvent: ', updateEvent)
        } catch (error) {
            console.log('error: ', error)
        }
    }, [updateEvent])

    const getInitialEvent = async (id) => {
        console.log('getInitialEvent')
        const { data, error } = await supabase
            .from('events')
            .select('*')
            .eq('id', id)
        if (error) {
            setError(error.message)
            supabase.removeSubscription(mySubscription)
            mySubscription = null
            return
        }
        setEvent(data[0])
    }

    const getEventAndSubscribe = async (id) => {
        console.log('getEventAndSubscribe. id: ', id)
        setError('')
        getInitialEvent(id)
        if (!mySubscription) {
            mySubscription = supabase
                .from(`events:id=eq.${id}`)
                .on('UPDATE', (payload) => {
                    console.log('UPDATE')
                    handleUpdateEvent(payload.new)
                })
                .subscribe()
        } else {
            supabase.removeSubscription(mySubscription)
        }
    }

    return (
        <Box>
            <Box display="flex" style={{ margin: 10, padding: 8 }}>
                <Box m="auto">
                    <Box className={classes.avatar}>
                        <img src={`/images/countries_euro2020/${event.home_team_id}.png`} height="60" style={{ marginRight: '10px' }} />
                        <img src={`/images/countries_euro2020/${event.visitor_team_id}.png`} height="60" style={{ marginLeft: '10px' }} />
                    </Box>
                    <Typography variant="h5" align="center">
                        {event.home_team_name} - {event.visitor_team_name}
                    </Typography>
                    {/* <Typography component="p" align="center">
                        <b>{event.home_team_score}</b>&nbsp;:&nbsp;<b>{event.visitor_team_score}</b>
                    </Typography> */}
                    <Typography component="p" align="center">
                        <b>{event.venue_name}</b>,&nbsp;<b>{event.city}</b>
                    </Typography>
                    <Typography component="p" align="center">
                        <NoSsr>
                            <Moment format="ddd Do MMM YYYY, HH:mm">{event.date}</Moment>
                        </NoSsr>
                    </Typography>
                </Box>
            </Box>
        </Box>
    )
}
