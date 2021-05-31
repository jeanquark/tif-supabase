import React from 'react'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/initSupabase'
import { makeStyles } from '@material-ui/core/styles'
import { Auth } from '@supabase/ui'
import Head from 'next/head'
import Link from 'next/link'
import Moment from 'react-moment'
import Navbar from '../components/Navbar'

import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import { AppBar, Toolbar, Container, Grid, Box, Typography, Paper } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    media: {
        height: 80,
        textAlign: 'center',
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        fontSize: '2em',
        color: theme.palette.text.secondary,
    },
    container: {
        paddingLeft: theme.spacing(5),
        paddingRight: theme.spacing(5),
    },
    avatar: {
        display: 'flex',
        '& > *': {
            margin: theme.spacing(1),
            width: theme.spacing(10),
            height: theme.spacing(7),
        },
    },
}))

export default function Fixtures() {
    const classes = useStyles()
    const { user, session } = Auth.useUser()
    const [fixtures, setFixtures] = useState([])
    useEffect(() => {
        fetchFixtures()
    }, [])

    const fetchFixtures = async () => {
        let { data: fixtures, error } = await supabase.from('events').select('*').order('id', true)
        if (error) console.log('error', error)
        else setFixtures(fixtures)
    }

    return (
        <>
            <Head>
				<title>Fixtures</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
            <Navbar title={'Fixtures'} links={['euro2020', 'test', 'actions', 'admin']} />

            <Container className={classes.container}>
                <Box my={5}>
                    <Grid container spacing={5}>
                        {fixtures.map((fixture) => (
                            <Grid item xs={12} sm={6} md={3} key={fixture.id}>
                                <Link href={`/events/${fixture.id}`}>
                                    <Card className={classes.root}>
                                        <CardActionArea>
                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                <CardMedia className={classes.media} title="Flags">
                                                    <div className={classes.avatar}>
                                                        <Avatar variant="square" alt="Country flag" src={fixture.home_team_image} />
                                                        <Avatar variant="square" alt="Country flag" src={fixture.visitor_team_image} className={classes.small} />
                                                    </div>
                                                </CardMedia>
                                            </div>
                                            <CardContent>
                                                <Typography gutterBottom variant="h6" component="h3">
                                                    {fixture.home_team_name} - {fixture.visitor_team_name}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">
                                                    {fixture.venue}, {fixture.city}.
                                                </Typography>
                                                <Typography variant="caption" color="textPrimary" component="p">
                                                    <Moment format="ddd Do MMM YYYY HH:mm">{fixture.date}</Moment>
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Link>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Container>
        </>
    )
}
