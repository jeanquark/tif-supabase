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
import LockOpenIcon from '@material-ui/icons/LockOpen'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import { UserWrapper } from '../store/userContext'
import UserContext from '../store/userContext'
import SnackbarContext from '../store/snackbarContext'

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

export default function Login(props) {
    const classes = useStyles()
    const [errors, setErrors] = useState({
        password: {
            show: false,
            message: '',
        },
        password_confirmation: {
            show: false,
            message: '',
        },
    })
    const { setSnackbar } = useContext(SnackbarContext)

    const resetPassword = async (event) => {
        try {
            event.preventDefault()
            console.log('resetPassword: ', event)
            setErrors({
                password: {
                    show: false,
                    message: '',
                },
                password_confirmation: {
                    show: false,
                    message: '',
                },
            })

            if (!event.target.password.value) {
                setErrors({
                    ...errors,
                    password: {
                        show: true,
                        message: 'Password is required',
                    },
                })
            }
            if (event.target.password.value !== event.target.password_confirmation.value) {
                setErrors({
                    ...errors,
                    password_confirmation: {
                        show: true,
                        message: 'Password confirmation does not match',
                    },
                })
            }

            console.log('event.target.password.value: ', event.target.password.value)
            const new_password = event.target.password.value
            const access_token = ''
            const { error, data } = await supabase.auth.api
                .updateUser(access_token, { password: new_password })
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
            console.log('data: ', data)
            setSnackbar({
                open: true,
                message: 'Password was reset!',
                severity: 'success'
            })
        } catch (error) {
            console.log('error: ', error)
        }
    }

    return (
        <div className={classes.paper}>
            <Avatar className={classes.avatar}>
                <LockOpenIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                Reset password
            </Typography>
            <form className={classes.form} noValidate onSubmit={resetPassword}>
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
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="password_confirmation"
                    label="Password confirmation"
                    type="password"
                    id="password_confirmation"
                    autoComplete="current-password"
                    error={errors.password_confirmation.show}
                    helperText={errors.password_confirmation.message}
                />
                <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                    Reset
                </Button>
                <Box mt={3}>
                    <Grid container justify="space-between">
                        <Grid item>
                            <Button color="secondary" onClick={() => props.setForm('login')}>
                                Back to login
                            </Button>
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
