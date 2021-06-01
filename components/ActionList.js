import React from 'react'
import { useEffect, useState, useContext, useRef } from 'react'
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles'
import { supabase } from '../lib/initSupabase'
import { Auth } from '@supabase/ui'
import moment from 'moment'
import AppBar from '@material-ui/core/AppBar'
import CssBaseline from '@material-ui/core/CssBaseline'
import Button from '@material-ui/core/Button'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Paper from '@material-ui/core/Paper'
import Fab from '@material-ui/core/Fab'
import List from '@material-ui/core/List'
import AvatarGroup from '@material-ui/lab/AvatarGroup'
import Avatar from '@material-ui/core/Avatar'
import MenuIcon from '@material-ui/icons/Menu'
import AddIcon from '@material-ui/icons/Add'
import SearchIcon from '@material-ui/icons/Search'
import MoreIcon from '@material-ui/icons/MoreVert'
import Box from '@material-ui/core/Box'
import Tooltip from '@material-ui/core/Tooltip'
import ActionCard from './ActionCard'
import UserContext from '../store/userContext'
import ActionsContext from '../store/actionsContext'

const useStyles = makeStyles((theme) => ({
    text: {
        padding: theme.spacing(2, 2, 0),
    },
    paper: {
        paddingBottom: 20,
    },
    list: {
        marginBottom: theme.spacing(2),
    },
    subheader: {
        backgroundColor: theme.palette.background.paper,
    },
    appBar: {
        top: 'auto',
        bottom: 0,
    },
    grow: {
        flexGrow: 1,
    },
    actionCard: {
        '&:hover': {
            cursor: 'pointer',
            background: theme.palette.primary.main,
            // background: rgba(0, 0, 0, 0.04),
            color: 'white',
        },
    },
    fabButton: {
        position: 'absolute',
        zIndex: 1,
        top: -25,
        left: 0,
        right: 0,
        margin: '0 auto',
    },
}))

export default function ActionList() {
    const classes = useStyles()
    // const { user } = Auth.useUser()
    const { user } = useContext(UserContext)
    const { actions } = useContext(ActionsContext)
    const router = useRouter()
    const { id } = router.query
    // const [actions, setActions] = useState([])
    const [eventActions, setEventActions] = useState([])
    const [eventUsers, setEventUsers] = useState([])
    const [updateAction, handleUpdateAction] = useState('')
    const [joinAction, handleJoinAction] = useState('')
    const [deleteAction, handleDeleteAction] = useState('')
    const userRef = useRef()
    const actionsRef = useRef()
    const eventUsersRef = useRef()
    userRef.current = user
    actionsRef.current = actions
    eventUsersRef.current = eventUsers
    let mySubscription = null

    useEffect(() => {
        try {
            console.log('[useEffect] getActionsAndSubscribe() id: ', id)
            if (id != undefined) {
                getActionsAndSubscribe(id)
            }
            return async () => {
                const { data } = await supabase.removeSubscription(mySubscription)
                console.log('[useEffect] Remove supabase subscription by useEffect unmount. data: ', data)
                // Remove user from event_users table
                console.log('[useEffect] userRef.current: ', actionsRef.current)
                if (userRef.current) {
                    await supabase.from('event_users').upsert({ user_id: userRef.current.id, event_id: null }, { onConflict: 'user_id' })
                }
            }
        } catch (error) {
            console.log('error: ', error)
        }
    }, [id])

    // useEffect(() => {
    //     console.log('[useEffect] fetchActions()')
    //     fetchActions()
    // }, [])

    useEffect(() => {
        try {
            console.log('[useEffect] updateAction: ', updateAction)
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
            console.log('[useEffect] joinAction: ', joinAction)
            if (joinAction) {
                const index = eventActions.findIndex((a) => a.id == joinAction.id)
                console.log('index: ', index)
                if (index != -1) {
                    let newActions = [...eventActions]
                    newActions[index]['has_joined'] = true
                    console.log('newActions: ', newActions)
                    setEventActions(newActions)
                }
            }
        } catch (error) {
            console.log('error: ', error)
        }
    }, [joinAction])

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

    const getActionsAndSubscribe = async (id) => {
        try {
            console.log('getActionsAndSubscribe() id: ', id)
            await getInitialActions(id)

            if (!mySubscription) {
                mySubscription = supabase
                    .from(`event_actions:event_id=eq.${id}`)
                    .on('INSERT', (payload) => {
                        console.log('INSERT payload.new: ', payload.new)
                        const action = actionsRef.current.find((action) => action.id == payload.new.action_id)
                        const user = eventUsersRef.current.find((eventUser) => eventUser.user_id == payload.new.user_id)
                        // console.log('INSERT action: ', action)
                        console.log('INSERT user: ', user)
                        const newEventAction = {
                            actions: {
                                name: action.name,
                                image: action.image,
                            },
                            users: {
                                username: user.users?.username,
                            },
                            ...payload.new,
                        }
                        setEventActions((a) => [...a, newEventAction])
                    })
                    .on('UPDATE', (payload) => {
                        console.log('UPDATE: ', payload.new)
                        // console.log('actions: ', actions)
                        handleUpdateAction(payload.new)
                    })
                    .subscribe()
                // console.log('mySubscription: ', mySubscription)
            } else {
                supabase.removeSubscription(mySubscription)
                console.log('Delete message')
            }
        } catch (error) {
            console.log('error: ', error)
        }
    }

    const getInitialActions = async (id) => {
        try {
            console.log('getInitialActions() id: ', id)
            // console.log('getInitialActions() userRef.current: ', userRef.current)
            // console.log('getInitialActions() useContext(UserContext): ', useContext(UserContext))
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
                    console.log('error: ', errorActions)
                    supabase.removeSubscription(mySubscription)
                    mySubscription = null
                    return
                }
                console.log('actions: ', actions)
                setEventActions(actions)

                // 2) Add user to event
                if (userRef.current) {
                    await supabase.from('event_users').upsert({ user_id: userRef.current.id, event_id: id }, { onConflict: 'user_id' })
                }

                // 3) Retrieve event users
                const { data: users, errorUsers } = await supabase.from('event_users').select('id, event_id, user_id, users (username, image)').eq('event_id', id)
                if (errorUsers) console.log('error: ', errorUsers)
                setEventUsers(users)

                // 4) Retrieve all event actions user has already joined
                if (userRef.current) {
                    const { data: joinedActions, errorJoinedActions } = await supabase.from('event_actions_users').select('*').eq('user_id', userRef.current.id)
                    if (errorJoinedActions) console.log('error: ', errorJoinedActions)
                    console.log('joinedActions: ', joinedActions)
                    for (let i = 0; i < joinedActions.length; i++) {
                        handleJoinAction({ id: joinedActions[i]['event_action_id'] })
                    }
                }

            }
        } catch (error) {
            console.log('error: ', error)
        }
    }

    // const fetchActions = async () => {
    //     try {
    //         const { data, error } = await supabase.from('actions').select('*').order('id', true)
    //         console.log('data: ', data)
    //         if (error) console.log('error: ', error)
    //         else setActions(data)
    //     } catch (error) {
    //         console.log('error: ', error)
    //     }
    // }

    const calculateParticipationThreshold = () => {
        console.log('calculateParticipationThreshold eventUsers: ', eventUsers)
        if (eventUsers.length < 2) {
            return 2
        }
        return eventUsers.length * 0.5
    }

    const calculateExpirationTime = () => {
        console.log('calculateExpirationTime')
        return moment().utc().add(10, 'minutes')
    }

    const createAction = async (actionId) => {
        try {
            console.log('createAction')
            if (!user) {
                alert('You must be authenticated to launch an action.')
                return
            }
            console.log('user.id: ', user.id)
            const { data, error } = await supabase
                .from('event_actions')
                .insert([{ event_id: id, user_id: user.id, action_id: actionId, points: 10, participation_threshold: calculateParticipationThreshold(), expired_at: calculateExpirationTime() }])

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

    return (
        <React.Fragment>
            <CssBaseline />
            <h1 style={{ textAlign: 'center' }}>Actions:</h1>
            <br />
            <Box display="flex" style={{ border: '1px solid orange' }}>
                <h3>Event users:</h3>
                <AvatarGroup max={4}>
                    {eventUsers.map((eventUser) => (
                        <Tooltip title={eventUser.users?.username} key={eventUser.id}>
                            <Avatar alt={eventUser.users.username} src={`/images/avatar.png`} />
                        </Tooltip>
                    ))}
                </AvatarGroup>
            </Box>
            <h3>Choose action:</h3>
            <Box display="flex" style={{ border: '1px solid red' }}>
                {actions.map((action) => (
                    <Box m={1} p={0} key={action.id}>
                        <Paper elevation={1} className={classes.actionCard} style={{ padding: '10px' }} onClick={() => createAction(action.id)}>
                            <Typography variant="h6">{action.name}</Typography>
                            <Typography variant="body2">{action.description}</Typography>
                        </Paper>
                    </Box>
                ))}
            </Box>
            <h3>Event actions:</h3>
            <Box style={{ maxHeight: '450px', overflow: 'auto', border: '1px solid green' }}>
                <Paper square className={classes.paper}>
                    <Typography className={classes.text} variant="h5" gutterBottom>
                        Event actions
                    </Typography>
                    <List className={classes.list}>
                        {eventActions.map((eventAction) => (
                            <ActionCard eventAction={eventAction} onJoinAction={handleJoinAction} onDeleteAction={handleDeleteAction} key={eventAction.id} />
                        ))}
                    </List>
                </Paper>
                <AppBar position="sticky" color="primary" className={classes.appBar}>
                    <Toolbar variant="dense">
                        {!user && 'Login to participate'}
                        <Fab color="secondary" size="medium" aria-label="add" className={classes.fabButton}>
                            <AddIcon />
                        </Fab>
                        <div className={classes.grow} />
                        <IconButton edge="end" color="inherit">
                            <SearchIcon />
                        </IconButton>


                        {/* <IconButton edge="start" color="inherit" aria-label="open drawer">
                            <MenuIcon />
                        </IconButton>
                        <Fab color="secondary" size="medium" aria-label="add" className={classes.fabButton}>
                            <AddIcon />
                        </Fab>
                        <div className={classes.grow} />
                        <IconButton color="inherit">
                            <SearchIcon />
                        </IconButton>
                        <IconButton edge="end" color="inherit">
                            <MoreIcon />
                        </IconButton> */}
                    </Toolbar>
                </AppBar>
            </Box>
        </React.Fragment>
    )
}
