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
import Login from '../../components/Login'
import { Container, Grid, AppBar, Toolbar, Box, Button, Typography, IconButton, Menu, MenuItem } from '@material-ui/core'

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
    const [component, setComponent] = useState('actionList')

    function showComponent () {
		switch (component) {
            case 'actionList':
				return <ActionList setComponent={setComponent} />
				break
			case 'login':
				return <Login setComponent={setComponent} />
				break
			default:
				return <ActionList setComponent={setComponent} />
		}
	}

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
                                <EventDetails />
                                {/* user.role: {user?.role} */}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                {/* <MessageList /> */}
                                <ActionList />
                                {/* {showComponent()} */}
                            </Grid>
                        </Grid>
                    </Container>
            </main>
        </div>
    )
}

export default Event
