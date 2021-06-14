import { useState, useEffect, useContext, useRef } from 'react'
import { supabase } from '../lib/initSupabase'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles'
import {
    Avatar,
    Container,
    Card,
    CardActionArea,
    CardMedia,
    CardContent,
    Grid,
    Box,
    Paper,
    Typography,
    Toolbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    NoSsr,
} from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Navbar from '../components/Navbar'
import dynamic from 'next/dynamic'
import Moment from 'react-moment'
import { Router } from 'next/router'
import moment from 'moment'
import EventsContext from '../store/eventsContext'

import {
    CSSTransition,
    TransitionGroup,
} from 'react-transition-group'

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        // height: '100vh',
        // overflow: 'auto',
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    flag: {
        display: 'flex',
        '& > *': {
            marginTop: theme.spacing(2),
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
            width: theme.spacing(7),
            height: theme.spacing(5),
        },
    },
    media: {
        // height: 60,
        textAlign: 'center',
    },
    avatar: {
        width: theme.spacing(3),
        height: theme.spacing(3),
        display: 'inline-block',
        verticalAlign: 'middle',
        margin: '0em 1em',
    },
    inline: {
        display: 'inline-block',
        verticalAlign: 'middle',
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    typography: {
        textAlign: 'center',
        margin: 'auto',
    },
    hover: {
        cursor: 'pointer',
    },
    box: {
        margin: '.5em'
    }
}))

export default function euro2020() {
    const classes = useStyles()
    const router = useRouter()
    const { events: fixtures, setEvents: setFixtures } = useContext(EventsContext)
    // const [fixtures, setFixtures] = useState([])
    const [fixturesByGroup, setFixturesByGroup] = useState([[]])
    const [nextFixtures, setNextFixtures] = useState([])
    const [standingsByGroup, setStandingsByGroup] = useState([[]])
    const [country, setCountry] = useState('europe-uefa-euro2020')
    const [updateEvent, handleUpdateEvent] = useState([])
    const fixturesRef = useRef()
    fixturesRef.current = fixtures
    let subscriptionEvents = null

    useEffect(() => {
        try {
            // console.log('[useEffect] default')
            // console.log('[useEffect] default fixturesRef.current: ', fixturesRef.current)
            subscribeToEvents()
            return async () => {
                // 1) Remove subscription
                const { data } = await supabase.removeSubscription(subscriptionEvents)
                console.log('[useEffect] Remove supabase subscription by useEffect unmount. data: ', data)
            }
        } catch (error) {
            console.log('error: ', error)
        }
    }, [])

    useEffect(() => {
        console.log('useEffect')
        const nextFixtures = fixtures.filter((fixture) => moment(fixture.date).format('YYYY-MM-DD') >= moment().utc().format('YYYY-MM-DD')).slice(0, 3)
        console.log('nextFixtures: ', nextFixtures)
        setNextFixtures(nextFixtures)
        const array = [[]]
        let index
        const groupIndexHashObject = {
            A: 0,
            B: 1,
            C: 2,
            D: 3,
            E: 4,
            F: 5,
        }
        for (let i = 0; i < fixtures.length; i++) {
            index = groupIndexHashObject[fixtures[i]['group_name']]
            if (!array[index]) {
                array[index] = []
            }
            array[index].push(fixtures[i])
        }
        setFixturesByGroup(array)
    }, [fixtures])

    useEffect(() => {
        fetchStandings()
    }, [])

    useEffect(() => {
        try {
            console.log('[useEffect] updateEvent: ', updateEvent)
            if (updateEvent) {
                const index = fixtures.findIndex((a) => a.id == updateEvent.id)
                console.log('index: ', index)
                if (index != -1) {
                    // 1) Update fixtures array
                    let newFixtures = [...fixtures]
                    console.log('newFixtures: ', newFixtures)
                    newFixtures[index] = updateEvent
                    setFixtures(newFixtures)

                    // 2) Update fixturesByGroup object
                    updateFixturesByGroup(newFixtures)
                }
            }
        } catch (error) {
            console.log('error: ', error)
        }
    }, [updateEvent])

    const subscribeToEvents = async () => {
        // console.log('getSubscriptions: ', supabase.getSubscriptions())
        // console.log('subscriptionEvents 2: ', subscriptionEvents)
        if (!subscriptionEvents) {
            supabase
                .from(`events:league_id=eq.4`)
                .on('UPDATE', (payload) => {
                    console.log('[UPDATE] payload: ', payload)
                    // console.log('fixtures: ', fixtures)
                    // console.log('fixturesRef.current: ', fixturesRef.current)
                    // console.log('updateEvent: ', updateEvent)
                    const index = fixturesRef.current.findIndex((a) => a.id == payload.new.id)
                    console.log('index: ', index)
                    if (index != -1) {
                        // 1) Update fixtures array
                        let newFixtures = [...fixturesRef.current]
                        // console.log('newFixtures: ', newFixtures)
                        newFixtures[index] = payload.new
                        setFixtures(newFixtures)
                        // console.log('payload.new: ', payload.new)

                        // 2) Update fixturesByGroup object
                        updateFixturesByGroup(newFixtures)
                    }
                })
                .subscribe()
        }
    }

    const fetchStandings = async () => {
        let { data: standings, error } = await supabase.from('standings').select('*').order('group_name', true).order('rank', true)
        if (error) console.log('error', error)
        else {
            console.log('standings: ', standings)
            const array = [[]]
            let temp = ''
            let count = -1
            for (let i = 0; i < standings.length; i++) {
                if (standings[i]['group_name'] != temp) {
                    temp = standings[i]['group_name']
                    count++
                    array[count] = []
                    array[count].push(standings[i])
                } else {
                    array[count].push(standings[i])
                }
            }
            setStandingsByGroup(array)
            // console.log('standingsByGroup: ', standingsByGroup)
        }
    }

    // const subscribeToFixtures = () => {
    //     const mySubscription = supabase
    //         .from(`events`)
    //         .on('UPDATE', (payload) => {
    //             console.log('UPDATE: ', payload)
    //             console.log('fixtures: ', fixtures)
    //         })
    //         .subscribe()
    //     console.log('mySubscription: ', mySubscription)
    // }

    const updateFixturesByGroup = (fixtures) => {
        // console.log('fixturesByGroup2: ', fixtures)
        const array = [[]]
        let index
        const groupIndexHashObject = {
            A: 0,
            B: 1,
            C: 2,
            D: 3,
            E: 4,
            F: 5,
        }
        for (let i = 0; i < fixtures.length; i++) {
            index = groupIndexHashObject[fixtures[i]['group_name']]
            if (!array[index]) {
                array[index] = []
            }
            array[index].push(fixtures[i])
        }
        // console.log('array: ', array)
        setFixturesByGroup(array)
        return array
    }

    const displayScore = (fixture) => {
        if (parseInt(fixture.timestamp) <= parseInt(moment().utc().unix())) {
            return (<TableCell align="center">
                {fixture.home_team_score} - {fixture.visitor_team_score}
            </TableCell>)
        } else {
            return (
                <TableCell align="center">
                    <Moment local format="DD-MM HH:mm">
                        {fixture.date}
                    </Moment>
                </TableCell>
            )
        }
    }

    const redirectTo = (link) => {
        console.log('redirectTo: ', link)
        router.push(`/events/${link}`)
    }

    const getDynamicComponent = (c) =>
        dynamic(() => import(`../components/svg/${c}`), {
            ssr: false,
            loading: () => <p>Loading map...</p>,
        })

    const DynamicComponent = getDynamicComponent(country)

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
                    {/* <Grid>
                        <ul>
                            {fixtures.map((event) => (
                                <li key={event.id}>{event.home_team_name}</li>
                            ))}
                        </ul>
                    </Grid> */}

                    <Grid container alignItems="center" justify="center" className={classes.root} style={{ paddingTop: '0px', marginTop: '0px', border: '0px solid red' }}>
                        <Grid container item style={{ border: '0px solid green' }}>
                            <Grid container item direction="column" justify="flex-start" sm={12} md={3} style={{ border: '0px solid pink' }}>
                                <Typography variant="h6" className={classes.typography}>Next fixtures</Typography>
                                <TransitionGroup className="todo-list">
                                    {nextFixtures.map((fixture) => (
                                        <CSSTransition
                                            key={fixture.id}
                                            timeout={1500}
                                            classNames="item"
                                        >
                                            <Box my={5} key={fixture.id} className={classes.box}>
                                                <Link href={`/events/${fixture.id}`}>
                                                    <Card>
                                                        <CardActionArea>
                                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                <CardMedia className={classes.media} title="Flags">
                                                                    <div className={classes.flag}>
                                                                        <Avatar variant="square" alt="Country flag" src={`/images/countries_euro2020/${fixture.home_team_image}`} />
                                                                        <Avatar variant="square" alt="Country flag" src={`/images/countries_euro2020/${fixture.visitor_team_image}`} className={classes.small} />
                                                                    </div>
                                                                </CardMedia>
                                                            </div>
                                                            <CardContent style={{}}>
                                                                <Typography gutterBottom variant="h6" component="h3" className={classes.typography}>
                                                                    {fixture.home_team_name} - {fixture.visitor_team_name}
                                                                </Typography>

                                                                <Typography variant="body2" color="textSecondary" component="p">
                                                                    {fixture.venue_name}, {fixture.city}.
                                                        </Typography>
                                                                <Typography variant="caption" color="textPrimary" component="p">
                                                                    <Moment format="ddd Do MMM YYYY HH:mm">{fixture.date}</Moment>
                                                                </Typography>
                                                            </CardContent>
                                                        </CardActionArea>
                                                    </Card>
                                                </Link>
                                            </Box>
                                        </CSSTransition>
                                    ))}
                                </TransitionGroup>
                            </Grid>

                            <Grid item sm={12} md={9} align="right">
                                <DynamicComponent style={{}} />
                            </Grid>
                        </Grid>

                        <Grid item sm={12} md={12}>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Box mt={4} mb={1}>
                                        <Typography gutterBottom variant="h5" className={classes.typography}>
                                            Group phase
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid
                                    container
                                    spacing={3}
                                    style={{
                                        margin: 0,
                                        width: '100%',
                                    }}
                                >
                                    {standingsByGroup.map((group, index) => (
                                        <Grid item xs={12} sm={6} md={12} lg={6} key={index}>
                                            <TableContainer component={Paper} key={index}>
                                                <Box my={2}>
                                                    <Typography variant="h6" className={classes.typography}>
                                                        {group && group[0] ? group[0]['group_name'] : ''}
                                                    </Typography>
                                                </Box>

                                                {/* <NoSsr> */}
                                                <Table aria-label="simple table" size="small">
                                                    <TableBody>
                                                        {fixturesByGroup[index]?.map((fixture, index) => (
                                                            <TableRow key={index} hover className={classes.hover} onClick={() => redirectTo(fixture.id)}>
                                                                <TableCell align="left">
                                                                    <Avatar className={classes.avatar} src={`/images/countries_euro2020/${fixture.home_team_id}.png`} />
                                                                    <span className={classes.inline}>{fixture.home_team_name}</span>
                                                                </TableCell>
                                                                {displayScore(fixture)}
                                                                <TableCell align="right">
                                                                    <span className={classes.inline}>{fixture.visitor_team_name}</span>
                                                                    <Avatar className={classes.avatar} src={`/images/countries_euro2020/${fixture.visitor_team_id}.png`} />
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                                {/* </NoSsr> */}

                                                <br />
                                                <br />

                                                <Table aria-label="simple table" size="small">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>Rank</TableCell>
                                                            <TableCell align="right">pts</TableCell>
                                                            <TableCell align="right">played</TableCell>
                                                            <TableCell align="right">+/-</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {group.map((team, index) => (
                                                            <TableRow key={team.id}>
                                                                <TableCell component="th" scope="row">
                                                                    {team.rank}.&nbsp;&nbsp;{team.team_name}
                                                                </TableCell>
                                                                <TableCell align="right">{team.points}</TableCell>
                                                                <TableCell align="right">{team.all_played}</TableCell>
                                                                <TableCell align="right">{team.goals_diff}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Container>
            </main>
        </div>
    )
}
