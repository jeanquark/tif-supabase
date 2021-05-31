import React from 'react'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/initSupabase'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { makeStyles } from '@material-ui/core/styles'
import { Auth } from '@supabase/ui'
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}))

export default function ButtonAppBar(props) {
    const router = useRouter()
    const classes = useStyles()
    const { user, session } = Auth.useUser()

    async function loginHandler(e) {
        router.push('/')
    }
    async function logoutHandler(e) {
        const { error } = await supabase.auth.signOut()
        if (!error) {
            alert('You are logged out!')
        }
    }

    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            console.log('onAuthStateChange event: ', event)
            if (event === 'PASSWORD_RECOVERY') setAuthView('update_password')
            if (event === 'USER_UPDATED') setTimeout(() => setAuthView('sign_in'), 1000)
            // Send session to /api/auth route to set the auth cookie.
            // NOTE: this is only needed if you're doing SSR (getServerSideProps)!
            fetch('/api/auth', {
                method: 'POST',
                headers: new Headers({ 'Content-Type': 'application/json' }),
                credentials: 'same-origin',
                body: JSON.stringify({ event, session }),
            })
			.then((res) => res.json())
			.then((abc) => console.log('abc: ', abc))
        })

        return () => {
            authListener.unsubscribe()
        }
    }, [])
    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        {props.title}
                    </Typography>

                    {user ? (
                        <>
                            <Box mx={2}>Welcome, {user?.email}</Box>
                            {props.links?.map((link, index) => (
                                <Link href={link} passHref key={index}>
                                    <Button component="a" color="inherit">
                                        {link}
                                    </Button>
                                </Link>
                            ))}
                            <Button color="inherit" onClick={logoutHandler}>
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            {props.links?.map((link, index) => (
                                <Link href={`/${link}`} passHref key={index}>
                                    <Button component="a" color="inherit">
                                        {link}
                                    </Button>
                                </Link>
                            ))}
                            <Button color="inherit" onClick={loginHandler}>
                                Login
                            </Button>
                        </>
                    )}
                </Toolbar>
            </AppBar>
        </div>
    )
}
