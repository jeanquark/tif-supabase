import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { supabase } from '../lib/initSupabase'
import { makeStyles } from '@material-ui/core/styles'
import { Box, Paper, Avatar, Typography, NoSsr } from '@material-ui/core'
import Moment from 'react-moment'
import moment from 'moment'
import Countdown, { calcTimeDelta, zeroPad } from 'react-countdown'
import { RestoreOutlined } from '@material-ui/icons'


const useStyles = makeStyles((theme) => ({
    avatar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
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
    // let mySubscription = null
    let subscriptionEvents = null
    const [event, setEvent] = useState('')
    const [updateEvent, handleUpdateEvent] = useState(null)
    const [error, setError] = useState('')
    const [timer, setTimer] = useState(12572000)
    const [timeToEvent, setTimeToEvent] = useState(null)

    useEffect(() => {
        console.log('[useEffect] id: ', id)
        if (id != undefined) {
            getEventAndSubscribe(id)
        }
        return async () => {
            const { data } = await supabase.removeSubscription(subscriptionEvents)
            console.log('Remove supabase subscription by useEffect unmount. data: ', data)
        }
    }, [id])

    useEffect(() => {
        try {
            console.log('[useEffect] updateEvent: ', updateEvent)
            if (updateEvent) {
                setEvent(updateEvent)
            }
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
            supabase.removeSubscription(subscriptionEvents)
            subscriptionEvents = null
            return
        }
        setEvent(data[0])
    }

    const getEventAndSubscribe = async (id) => {
        console.log('getEventAndSubscribe. id: ', id)
        setError('')
        getInitialEvent(id)
        if (!subscriptionEvents) {
            subscriptionEvents = supabase
                .from(`events:id=eq.${id}`)
                .on('UPDATE', (payload) => {
                    console.log('UPDATE')
                    handleUpdateEvent(payload.new)
                })
                .subscribe()
        } else {
            supabase.removeSubscription(subscriptionEvents)
        }
    }

    const renderer = ({ hours, minutes, seconds, completed }) => {
        if (completed) {
            // Render a completed state
            return ''
        } else {
            // Render a countdown
            // return <span>{zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}</span>;
            return calcTimeDelta(Date.now() + 1000).minutes
        }
    };

    const displayResult = (timeToEvent) => {
        if (parseInt(event.timestamp) <= parseInt(moment().unix())) {
            return <Typography component="p" align="center">
                {event.home_team_score} : {event.visitor_team_score}
            </Typography>
        }
        return (
            <Countdown
                date={Date.now() + (timeToEvent)}
                renderer={props => <Typography component="p" align="center">
                    {'Starts in '}{zeroPad(props.days)}:{zeroPad(props.hours)}:{zeroPad(props.minutes)}:{zeroPad(props.seconds)}
                </Typography>}
            />)
    }

    return (
        <Box>
            <Box display="flex" style={{ margin: 10, padding: 8 }}>
                <Box m="auto">
                    {event && <Box mb={2} className={classes.avatar}>
                        <img src={`/images/countries_euro2020/${event.home_team_image}`} height="60" style={{ marginRight: '10px' }} />
                        <img src={`/images/countries_euro2020/${event.visitor_team_image}`} height="60" style={{ marginLeft: '10px' }} />
                    </Box>}
                    <Typography variant="h5" align="center">
                        {event.home_team_name} - {event.visitor_team_name}
                    </Typography>
                    {/* <NoSsr> */}
                        {event && displayResult(parseInt(event.timestamp - moment().unix()) * 1000)}
                        {/* {event && displayResult(parseInt(event.timestamp))} */}
                        {/* {displayResult(12572000)} */}
                    {/* </NoSsr> */}
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