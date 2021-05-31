import React from 'react'
import Moment from 'react-moment'
import moment from 'moment'
import { supabase } from '../lib/initSupabase'
import { Auth } from '@supabase/ui'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import SkipNextIcon from '@material-ui/icons/SkipNext'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import ButtonBase from '@material-ui/core/ButtonBase'
import LinearProgress from '@material-ui/core/LinearProgress'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Avatar from '@material-ui/core/Avatar'
import Tooltip from '@material-ui/core/Tooltip'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        margin: 'auto',
        // maxWidth: 500,
    },
    image: {
        // width: 128,
        // height: 128,
    },
    img: {
        margin: 'auto',
        display: 'block',
        maxWidth: '100%',
        maxHeight: '100%',
    },
}))

export default function ActionCard({ eventAction }) {
    const classes = useStyles()
    const theme = useTheme()
    const { user, session } = Auth.useUser()

    const calculateRemainingTime = (expired_at) => {
        console.log('calculateRemainingTime')
        return Math.abs(moment().utc().diff(expired_at, 'seconds'))
    }

    const onCountdownTimeout = (eventAction) => {
        console.log('onCountdownTimeout() eventAction: ', eventAction)
        // Delete from store
        handleDeleteAction(eventAction)
    }

    const calculateParticipationProgress = (number_participants, participation_threshold) => {
        console.log('calculateParticipationProgress')
        return Math.floor((number_participants / participation_threshold) * 100)
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
                <>
                    <Button variant="outlined" size="small" color="primary" disabled={true}>
                        Join
                    </Button>
                    <Button size="small" color="primary">
                        Login to participate
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

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <Grid container spacing={2}>
                    <Grid item xs={2}>
                        <ButtonBase className={classes.image}>
                            <img className={classes.img} alt="complex" src={`/images/actions/${eventAction.actions?.image}`} />
                        </ButtonBase>
                    </Grid>
                    <Grid item xs={10} sm container alignItems="center">
                        <Grid item xs container direction="column" spacing={2}>
                            <Grid item xs>
                                {/* <Typography gutterBottom variant="subtitle1">
                                    Action <b>{eventAction.actions?.name}</b> launched by <b>{eventAction.users?.username}</b> <Moment fromNow>{eventAction.created_at}</Moment>
                                </Typography> */}

                                <Tooltip title={eventAction.users?.username}>
                                    <Avatar alt={eventAction.users?.username} src={`/images/avatar.png`} />
                                </Tooltip>

                                <LinearProgressWithLabel value={Math.round(calculateParticipationProgress(eventAction.number_participants, eventAction.participation_threshold))} />
                            </Grid>
                            <Grid item>
                                {joinButton(eventAction)}
                            </Grid>
                        </Grid>
                        <Grid item>
                            {/* <Box align="center"> */}
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
                            {/* </Box> */}
                        </Grid>
                        <Grid item>
                            <Typography variant="subtitle1">$19.00</Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    )
}
