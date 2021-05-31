import { useState, useEffect } from 'react'
import { useRef } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/initSupabase'
import { makeStyles } from '@material-ui/core/styles'
import { Auth } from '@supabase/ui'
import Countdown from 'react-countdown'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import Moment from 'react-moment'
import moment from 'moment'
import { Avatar, Card, CardContent, CardMedia, Tooltip, Grid, Typography, TextField, Button, Paper, Box, LinearProgress, CircularProgress } from '@material-ui/core'
import DoneIcon from '@material-ui/icons/Done'
import ActionCard from './ActionCard2'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    container: {
        paddingLeft: theme.spacing(5),
        paddingRight: theme.spacing(5),
    },
    button: {
        verticalAlign: 'text-top',
        '&:hover': {
            color: '#000',
            cursor: 'pointer',
        },
    },
    paper: {
        '&:hover': {
            cursor: 'pointer',
            background: theme.palette.primary.main,
            color: 'white',
        },
    },
    progressBar: {
        height: 10,
        borderRadius: 5,
    },
    relative: {
        position: 'relative',
    },
    bottom: {
        color: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
    },
    top: {
        position: 'absolute',
        left: 0,
    },
    circle: {
        strokeLinecap: 'round',
    },
    '@keyframes timeOutAnimation': {
        '0%': {
            opacity: 1,
        },
        '50%': {
            opacity: 0.5,
        },
        '100%': {
            display: 'none',
            opacity: 0,
        },
    },
    timeOut: {
        animationName: `$timeOutAnimation`,
        animationDuration: 5000,
    },
}))

export default function ActionList() {
    const router = useRouter()
    const classes = useStyles()
    const { id } = router.query
    const { user, session } = Auth.useUser()
    const [action, setAction] = useState('')
    const [actions, setActions] = useState([])
    const [tests, setTests] = useState([])
    const [eventActions, setEventActions] = useState([])
    const [eventUsers, setEventUsers] = useState([])
    const [newAction, handleNewAction] = useState('')
    const [updateAction, handleUpdateAction] = useState('')
    const [deleteAction, handleDeleteAction] = useState('')
    const [error, setError] = useState('')
    const actionsEndRef = useRef(null)
    let mySubscription = null

    useEffect(() => {
        console.log('[useEffect] getActionsAndSubscribe() id: ', id)
        if (id != undefined) {
            getActionsAndSubscribe(id)
        }
        return async () => {
            const { data } = await supabase.removeSubscription(mySubscription)
            // Remove user from event
            await supabase.from('event_users').upsert({ user_id: 1, event_id: null }, { onConflict: 'user_id' })
            console.log('Remove supabase subscription by useEffect unmount. data: ', data)
        }
    }, [id])

    useEffect(() => {
        console.log('[useEffect] fetchActions()')
        fetchActions()
    }, [])

    useEffect(() => {
        try {
            console.log('[useEffect] updateAction: ', updateAction)
            console.log('eventActions: ', eventActions)

            if (updateAction) {
                const index = eventActions.findIndex((a) => a.id == updateAction.id)
                console.log('index: ', index)
                let newActions = [...eventActions]
                newActions[index]['number_participants'] = updateAction.number_participants
                newActions[index]['is_completed'] = updateAction.is_completed
                console.log('newActions: ', newActions)
                setEventActions(newActions)
            }
        } catch (error) {
            console.log('error: ', error)
        }
    }, [updateAction])

    useEffect(() => {
        try {
            console.log('[useEffect] deleteAction: ', deleteAction)
            if (deleteAction) {
                const index = eventActions.findIndex((a) => a.id == deleteAction.id)
                console.log('index: ', index)
                let newActions = [...eventActions]
                newActions[index]['is_timed_out'] = true
                console.log('newActions: ', newActions)
                setEventActions(newActions)
                setTimeout(() => {
                    setEventActions(eventActions.filter((a) => a.id !== deleteAction.id))
                }, 5000)
            }
        } catch (error) {
            console.log('error: ', error)
        }
    }, [deleteAction])

    const fetchActions = async () => {
        const { data, error } = await supabase.from('actions').select('*').order('id', true)
        console.log('data: ', data)
        if (error) console.log('error: ', error)
        else setActions(data)
    }

    const calculateParticipationThreshold = () => {
        console.log('calculateParticipationThreshold eventUsers: ', eventUsers)
        if (eventUsers.length < 2) {
            return 2
        }
        return eventUsers.length * 0.5
    }

    const calculateParticipationProgress = (number_participants, participation_threshold) => {
        console.log('calculateParticipationProgress')
        return Math.floor((number_participants / participation_threshold) * 100)
    }

    const calculateExpirationTime = () => {
        console.log('calculateExpirationTime')
        return moment().utc().add(10, 'minutes')
    }

    const abc = (expired_at) => {
        setInterval(function () {
            console.log('abc')
        }, 1000)

        return 40
    }

    const calculateRemainingTime = (expired_at) => {
        console.log('calculateRemainingTime')
        return Math.abs(moment().utc().diff(expired_at, 'seconds'))
    }

    const onCountdownTimeout = (eventAction) => {
        console.log('onCountdownTimeout() eventAction: ', eventAction)
        // Delete from store
        handleDeleteAction(eventAction)
    }

    const getInitialActions = async (id) => {
        console.log('getInitialActions() id: ', id)
        if (!eventActions.length) {
            // 1) Retrieve event actions
            const { data: actions, error: errorActions } = await supabase
                .from(`event_actions`)
                .select('id, number_participants, participation_threshold, expired_at, actions (name, image), events (home_team_name, visitor_team_name), users (id, username, full_name)')
                // .select('id, number_participants, participation_threshold, expired_at, actions (name), events (home_team_name, visitor_team_name)')
                .eq('event_id', id)
                .gt('expired_at', moment().utc())
                .order('id', { ascending: true })
            if (errorActions) {
                setError(errorActions.message)
                console.log('error: ', errorActions)
                supabase.removeSubscription(mySubscription)
                mySubscription = null
                return
            }
            console.log('actions: ', actions)
            setEventActions(actions)

            // 2) Add user to event
            await supabase.from('event_users').upsert({ user_id: 1, event_id: id }, { onConflict: 'user_id' })

            // 3) Retrieve event users
            const { data: users, errorUsers } = await supabase.from('event_users').select('*').eq('event_id', id)
            if (errorUsers) console.log('error: ', errorUsers)
            setEventUsers(users)

            // 4) Retrieve
        }
    }
    const getActionsAndSubscribe = async (id) => {
        try {
            console.log('getActionsAndSubscribe() id: ', id)
            setError('')
            getInitialActions(id)
            if (!mySubscription) {
                mySubscription = supabase
                    .from(`event_actions:event_id=eq.${id}`)
                    .on('INSERT', (payload) => {
                        console.log('INSERT: ', payload.new)
                        setEventActions((a) => [...a, payload.new])
                    })
                    .on('UPDATE', (payload) => {
                        console.log('UPDATE: ', payload.new)
                        // console.log('actions: ', actions)
                        handleUpdateAction(payload.new)
                    })
                    .subscribe()
            } else {
                supabase.removeSubscription(mySubscription)
                console.log('Delete message')
            }
        } catch (error) {
            console.log('error: ', error)
        }
    }

    const scrollToBottom = () => {
        console.log('scrollToBottom')
        actionsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const createAction = async (actionId) => {
        try {
            console.log('createAction')
            if (!user) {
                alert('You must be authenticated to choose an action.')
                return
            }
            const { data, error } = await supabase
                .from('event_actions')
                .insert([{ event_id: id, user_id: 1, action_id: actionId, participation_threshold: calculateParticipationThreshold(), expired_at: calculateExpirationTime() }])

            if (error) {
                alert(error.message)
                return
            }
            console.log('data: ', data)
            console.log('Successfully created action!')
        } catch (error) {
            console.log('error: ', error)
        }
    }
    const joinAction = async (eventActionId) => {
        try {
            console.log('joinAction: ', eventActionId)

            // 1) Add auth user to event_actions_users table
            const { error: error1 } = await supabase.from('event_actions_users').insert([
                {
                    event_action_id: eventActionId,
                    user_id: 1,
                },
            ])
            if (error1) {
                console.log('error1: ', error1)
                throw error1
            }

            // 2) Increment counter
            const { error2 } = await supabase.rpc('increment_participation_count_by_one', { row_id: parseInt(eventActionId) })
            if (error2) {
                console.log('error2: ', error2)
                throw error2
            }
        } catch (error) {
            console.log('error from joinAction: ', error)
        }
    }

    function joinButton(eventAction) {
        if (eventAction.is_timed_out) {
            return (
                <Button variant="outlined" size="small" color="primary" disabled={true}>
                    Time out
                </Button>
            )
        } else if (eventAction.is_completed) {
            return (
                <Button variant="outlined" size="small" color="primary" disabled={true} endIcon={<DoneIcon />}>
                    Completed
                </Button>
            )
        } else if (!user) {
            return (
                <>
                    <Button variant="outlined" size="small" color="primary" disabled={true}>
                        Join
                    </Button>
                    <Button size="small" color="primary">
                        Login first to join
                    </Button>
                </>
            )
        } else {
            return (
                <Button variant="outlined" size="small" color="primary" onClick={() => joinAction(eventAction.id)}>
                    Join
                </Button>
            )
        }
    }

    function LinearProgressWithLabel(props) {
        return (
            <Box display="flex" alignItems="center">
                <Box width="100%" mr={1}>
                    <LinearProgress variant="determinate" style={{ height: 10, borderRadius: 20 }} {...props} />
                </Box>
                <Box minWidth={35}>
                    <Typography variant="body2" color="textSecondary">{`${Math.round(props.value)}%`}</Typography>
                </Box>
            </Box>
        )
    }

    return (
        <>
            <h1 style={{ textAlign: 'center' }}>Actions:</h1>
            <br />
            <Box style={{ border: '1px solid orange' }}>
                <h3>Event users:</h3>
                {eventUsers.map((user) => (
                    <Tooltip title={user.username} key={user.id}>
                        <Avatar alt={user.username} src={`/images/avatar.png`} />
                    </Tooltip>
                ))}
            </Box>
            <h3>Choose action:</h3>
            <Box display="flex" style={{ border: '1px solid red' }}>
                {actions.map((action) => (
                    <Box m={1} p={0} key={action.id}>
                        <Paper elevation={1} className={classes.paper} style={{ padding: '10px' }} onClick={() => createAction(action.id)}>
                            <Typography variant="h6">{action.name}</Typography>
                            <Typography variant="body2">{action.description}</Typography>
                        </Paper>
                    </Box>
                ))}
            </Box>
            <h3>Event actions:</h3>
            <Box style={{ maxHeight: '450px', overflow: 'auto', border: '1px solid green' }}>
                <ActionCard style={{ }} />
                {/* {eventActions.map((eventAction) => (
                    <ActionCard key={eventAction.id} eventAction={eventAction} />

                    <Box key={eventAction.id}>
                        <Paper elevation={3} className={eventAction.is_timed_out && classes.timeOut} style={{ margin: 10, padding: 8 }}>
                            <Grid container alignItems="center" style={{ flexGrow: 1, display: 'flex' }}>
                                <Grid item xs={12}>
                                    Action <b>{eventAction.actions?.name}</b> launched by <b>{eventAction.users?.username}</b> <Moment fromNow>{eventAction.created_at}</Moment>
                                </Grid>

                                <Countdown date={eventAction.expired_at} />
                                <Grid item xs={12} sm={6} align="center">
                                    <Box>
                                        <CountdownCircleTimer
                                            isPlaying
                                            size="50"
                                            strokeWidth="6"
                                            duration={calculateRemainingTime(eventAction.expired_at)}
                                            colors={[
                                                ['#FF4500', 0.33],
                                                ['#19857B', 0.33],
                                                ['#A30000', 0.33],
                                            ]}
                                            children={({ remainingTime }) => {
                                                const minutes = Math.floor(remainingTime / 60)
                                                const seconds = remainingTime % 60

                                                return `${minutes}:${seconds}`
                                            }}
                                            onComplete={() => onCountdownTimeout(eventAction)}
                                        />
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={3} align="right" style={{ verticalAlign: 'center' }}>
                                    <Box position="relative" display="inline-flex">
                                        <CircularProgress variant="determinate" className={classes.bottom} size={60} thickness={5} value={100} />
                                        <CircularProgress
                                            variant="determinate"
                                            className={classes.top}
                                            classes={{
                                                circle: classes.circle,
                                            }}
                                            size={60}
                                            thickness={5}
                                            value={40}
                                        />
                                        <Box top={0} left={0} bottom={0} right={0} position="absolute" display="flex" alignItems="center" justifyContent="center">
                                            <Typography variant="caption" component="div" color="textSecondary">{`${Math.round(
                                                calculateRemainingTime(eventAction.expired_at)
                                            )}s`}</Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    {joinButton(eventAction)}

                                </Grid>
                                <Grid item xs={12}>
                                    <LinearProgressWithLabel value={Math.round(
                                        calculateParticipationProgress(eventAction.number_participants, eventAction.participation_threshold))} />
                                </Grid>
                            </Grid>
                        </Paper>
                    </Box>
                ))} */}
                <div ref={actionsEndRef} />
            </Box>
        </>
    )
}
