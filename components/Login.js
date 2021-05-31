import React from 'react'
import useSWR from 'swr'
import { Auth } from '@supabase/ui'
import { supabase } from '../lib/initSupabase'
import { useEffect, useState, useContext } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { Router, useRouter } from 'next/router'

import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Paper from '@material-ui/core/Paper'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import { UserWrapper } from '../store/userContext'
import UserContext from '../store/userContext'

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://material-ui.com/">
                TIF
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    )
}

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh',
    },
    button: {
        background: '#3C5A99',
        borderRadius: 3,
        border: 0,
        color: 'white',
        height: 38,
        padding: '0 30px',
    },
    image: {
        // backgroundImage: 'url(https://source.unsplash.com/random)',
        backgroundImage: 'url(/images/avatar-transparent.png)',
        backgroundRepeat: 'no-repeat',
        backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    paper: {
        margin: theme.spacing(8, 4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}))

const googleOAuthHandler = async () => {
    console.log('googleOAuthHandler')
    console.log('process.env.NODE_ENV: ', process.env.NODE_ENV)
    console.log('process.env.BASE_URL: ', process.env.NEXT_PUBLIC_BASE_URL)

    
    const { user, session, error } = await supabase.auth.signIn(
        {
            provider: 'google',
        },
        {
            // redirectTo: 'http://localhost:3000/fixtures',
            redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/euro2020`
        }
    )
    console.log('user: ', user)
    console.log('session: ', session)
    console.log('error: ', error)
}

export default function Login(props) {
    const classes = useStyles()
    const router = useRouter()
    const [errors, setErrors] = useState({
        password: {
            show: false,
            message: '',
        },
    })
    const userContext = useContext(UserContext)

    const signInUser = async (event) => {
        try {
            event.preventDefault()
            console.log('signInUser: ', event)
            // userContext.setUser({
            //     firstname: 'Jean-Marc',
            //     email: 'jm.kleger@ik.me',
            //     points: 10
            // })

            let { user, error } = await supabase.auth.signIn({
                email: event.target.email.value,
                password: event.target.password.value,
            })
            if (error) {
                console.log('error: ', error)
                setErrors({
                    ...errors,
                    password: {
                        show: true,
                        message: error.message,
                    },
                })
                return
            }
            console.log('user: ', user)
            userContext.setUser()
            router.push('/euro2020')
        } catch (error) {
            console.log('error: ', error)
        }
    }

    return (
        <div className={classes.paper}>
            <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                Sign in
            </Typography>
            <form className={classes.form} noValidate onSubmit={signInUser}>
                <TextField variant="outlined" margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" autoFocus />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    error={errors.password.show}
                    helperText={errors.password.message}
                />

                <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
                <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                    Sign In
                </Button>
                <Grid style={{ marginTop: 20 }}>
                    <Button variant="contained" fullWidth classes={{ root: classes.button }} onClick={googleOAuthHandler}>
                        Google login
                    </Button>
                </Grid>
                <Box mt={3}>
                    <Grid container>
                        {/* <Grid item xs>
                        <Link href="#" variant="body2">
                            Forgot password?
                        </Link>
                    </Grid> */}
                        <Grid item>
                            {/* showLoginForm: {props.showLoginForm} */}
                            <Button color="secondary" onClick={() => props.setShowLoginForm(false)}>
                                Don't have an account? Sign Up!
                            </Button>
                            {/* <Button color="secondary" onClick={props.setShowLoginForm = false}>Don't have an account? Sign up!</Button> */}
                        </Grid>
                    </Grid>
                </Box>

                <Box mt={5}>
                    <Copyright />
                </Box>
            </form>
        </div>
    )
}
