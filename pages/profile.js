import { useState, useContext } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { supabase } from '../lib/initSupabase'
import Navbar from '../components/Navbar'
import { makeStyles } from '@material-ui/core/styles'
import { Container, Grid, TextField, Button } from '@material-ui/core'
import SnackbarContext from '../store/snackbarContext'
import UserContext from '../store/userContext'

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}))
export default function Profile() {
    const classes = useStyles()

    // const [username, setUsername] = useState(user.username)
    const { snackbar, setSnackbar } = useContext(SnackbarContext)
    const { user } = useContext(UserContext)

    const updateUser = async (e) => {
        try {
            e.preventDefault()
            const username = e.target.username.value
            const { data, error } = await supabase.from('users').update({ username }).match({ id: user.id })
            if (error) {
                throw error
            }
            setSnackbar({
                open: true,
                message: 'Successful updated username!',
                severity: 'success'
            })
        } catch (error) {
            console.log('error: ', error)
        }
    }
    return (
        <>
            <Head>
                <title>Euro 2020</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Navbar />

            <main className={classes.content}>
                <div className={classes.appBarSpacer} />

                <Container maxWidth="lg" className={classes.container}>
                    user.email: {user?.email} - user.id: {user?.id} - user.username: {user?.username}
                    <Grid container spacing={3} justify="center">
                        <Grid item xs={12} sm={8} md={6}>
                            <form className={classes.form} noValidate onSubmit={updateUser}>
                                <TextField variant="outlined" margin="normal" required fullWidth id="email" label="Username" name="username" autoComplete="username" autoFocus />
                                <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                                    Update
                                </Button>
                            </form>
                        </Grid>
                    </Grid>
                </Container>
            </main>
        </>
    )
}
