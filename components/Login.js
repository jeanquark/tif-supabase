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
import ModalContext from '../store/modalContext'

import { useTranslation } from 'next-i18next'

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
        '&:hover': {
            background: '#263A62'
        }
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
        // margin: theme.spacing(8, 4),
        margin: props => props.modal ? 0 : theme.spacing(8, 4),
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
    // if (error) {
    //     console.log('error: ', error)
    //     return
    // }
    console.log('user: ', user)
    console.log('session: ', session)
    console.log('error: ', error)

    // userContext.setUser()
    // props.redirectTo ? router.push(props.redirectTo) : router.push('/euro2020')
}

export default function Login(props) {
    const classes = useStyles(props)
    const router = useRouter()
    const [errors, setErrors] = useState({
        password: {
            show: false,
            message: '',
        },
    })
    const userContext = useContext(UserContext)
    const { modal, setModal } = useContext(ModalContext)
    const { t } = useTranslation('common')

    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            console.log('[Login] onAuthStateChange event: ', event)
            // Send session to /api/auth route to set the auth cookie.
            // NOTE: this is only needed if you're doing SSR (getServerSideProps)!
            fetch('/api/auth', {
                method: 'POST',
                headers: new Headers({ 'Content-Type': 'application/json' }),
                credentials: 'same-origin',
                body: JSON.stringify({ event, session }),
            })
                .then((res) => res.json())
                .then(() => {
                    setModal({ open: false })
                    if (event === 'SIGNED_IN') {
                        console.log('SIGNED_IN')
                        userContext.setUser()
                    }
                })
        })
        return () => {
            authListener.unsubscribe()
        }
    }, [])

    const signInUser = async (event) => {
        try {
            event.preventDefault()
            console.log('signInUser: ', event)

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
            console.log('props: ', props)
            // router.push('/euro2020')
            // userContext.setUser()
            props.redirectTo ? router.push(props.redirectTo) : router.push('/euro2020')
        } catch (error) {
            console.log('error: ', error)
        }
    }

    function Copyright() {
        return (
            <>
                <Typography variant="body2" color="textSecondary" align="center">
                    {t('copyright')} {'??'}
                    <Link color="inherit" href="https://material-ui.com/">
                        TIF
                    </Link>{' '}
                    {new Date().getFullYear()}
                    {'.'}
                </Typography>
                <Typography variant="caption" color="textSecondary" display="block" align="center">
                    Last successful deployment: Thursday July 1, 16:26.
                </Typography>
            </>
        )
    }

    return (
        <div className={classes.paper}>
            <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                {t('sign-in')}
            </Typography>
            <form className={classes.form} noValidate onSubmit={signInUser}>
                <TextField variant="outlined" margin="normal" required fullWidth id="email" label={t('email_address')} name="email" autoComplete="email" autoFocus />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label={t('password')}
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    error={errors.password.show}
                    helperText={errors.password.message}
                />

                <FormControlLabel control={<Checkbox value="remember" color="primary" />} label={t('remember_me')} />
                <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                    {t('sign-in')}
                </Button>
                <Grid style={{ marginTop: 20 }}>
                    <Button variant="contained" fullWidth classes={{ root: classes.button }} onClick={googleOAuthHandler}>
                        {t('google-login')}
                    </Button>
                </Grid>
                <Box mt={3}>
                    <Grid container justify="space-between">
                        <Grid item>
                            <Button color="secondary" onClick={() => props.setForm('register')}>
                                {t('do-not-have-account')}
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button color="secondary" onClick={() => props.setForm('forgot-password')}>{t('forgot-password')}</Button>
                        </Grid>
                    </Grid>
                </Box>

                {!props.modal && <Box mt={5}>
                    <Copyright />
                </Box>}
            </form>
        </div>
    )
}
