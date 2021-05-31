import React from 'react'
import { useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { supabase } from '../lib/initSupabase'
import { Auth } from '@supabase/ui'
import moment from 'moment'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import Typography from '@material-ui/core/Typography'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import Avatar from '@material-ui/core/Avatar'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import LinearProgress from '@material-ui/core/LinearProgress'
import DoneIcon from '@material-ui/icons/Done'
import UserContext from '../store/userContext'

const useStyles = makeStyles((theme) => ({
    subheader: {
        backgroundColor: theme.palette.background.paper,
    },
    listItem: {
        '&:hover': {
            background: 'yellow'
        }
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

export default function ActionCard(props) {
    const { eventAction } = props
    const classes = useStyles()
    const { user } = useContext(UserContext)

    const calculateRemainingTime = (expired_at) => {
        console.log('calculateRemainingTime')
        return Math.abs(moment().utc().diff(expired_at, 'seconds'))
    }

    const calculateParticipationProgress = (number_participants, participation_threshold) => {
        console.log('calculateParticipationProgress')
        return Math.floor((number_participants / participation_threshold) * 100)
    }

    const onCountdownTimeout = (eventAction) => {
        console.log('onCountdownTimeout() eventAction: ', eventAction)
        // Delete from store
        props.onDeleteAction(eventAction)
        // handleDeleteAction(eventAction)
        // onDeleteAction(eventAction)
    }

    const joinAction = async (eventAction) => {
        try {
            console.log('joinAction: ', eventAction)

            // 3) Update state
            props.onJoinAction(eventAction)

            // 1) Add auth user to event_actions_users table
            const { error: error1 } = await supabase.from('event_actions_users').insert([
                {
                    event_action_id: eventAction.id,
                    user_id: user.id,
                },
            ])
            if (error1) {
                console.log('error1: ', error1)
                throw error1
            }

            // 2) Increment counter
            const { error2 } = await supabase.rpc('increment_participation_count_by_one', { row_id: parseInt(eventAction.id) })
            if (error2) {
                console.log('error2: ', error2)
                throw error2
            }

            
        } catch (error) {
            console.log('error from joinAction: ', error)
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
                <Button variant="outlined" size="small" color="primary" disabled={true}>
                    Join
                </Button>
            )
        } else if (eventAction.has_joined) {
            return (
                <Button variant="outlined" size="small" color="primary" disabled={true}>Joined</Button>
            )
        } else {
            return (
                <Button variant="outlined" size="small" color="primary" onClick={() => joinAction(eventAction)}>
                    Join
                </Button>
            )
        }
    }

    return (
        <React.Fragment>
            <ListItem className={classes.listItem}>
                <ListItemAvatar>
                    <Avatar alt="Profile Picture" src={`/images/actions/${eventAction.actions?.image}`} />
                </ListItemAvatar>
                <ListItemText primary={eventAction.actions?.name} secondary={eventAction.users?.username} />
                <ListItemText>
                    <LinearProgressWithLabel value={Math.round(calculateParticipationProgress(eventAction.number_participants, eventAction.participation_threshold))} />
                </ListItemText>
                <ListItemText>
                    <Box align="center" style={{ paddingTop: 7 }}>
                        <CountdownCircleTimer
                            isPlaying
                            size="45"
                            strokeWidth="4"
                            duration={calculateRemainingTime(eventAction.expired_at)}
                            colors={[
                                ['#ff4500', 0.33],
                                ['#e63e00', 0.33],
                                ['#cc3700', 0.33],
                            ]}
                            onComplete={() => onCountdownTimeout(eventAction)}
                            children={({ remainingTime }) => {
                                const minutes = Math.floor(remainingTime / 60)
                                const seconds = remainingTime % 60 < 10 ? '0' + (remainingTime % 60) : remainingTime % 60

                                return <Typography variant="caption" style={{ paddingBottom: 5 }}>{`${minutes}:${seconds}`}</Typography>
                            }}
                        />
                    </Box>
                </ListItemText>
                {joinButton(eventAction)}
            </ListItem>
        </React.Fragment>
    )
}
