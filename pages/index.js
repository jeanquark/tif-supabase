import React from 'react'
import useSWR from 'swr'
import { Auth } from '@supabase/ui'
import { supabase } from '../lib/initSupabase'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Login from '../components/Login'
import Register from '../components/Register'

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


const useStyles = makeStyles((theme) => ({
	root: {
		height: '100vh',
	},
	image: {
		// backgroundImage: 'url(https://source.unsplash.com/random)',
		backgroundImage: 'url(/images/avatar-transparent.png)',
		backgroundRepeat: 'no-repeat',
		backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
		backgroundSize: 'cover',
		backgroundPosition: 'center',
	},
}))


const fetcher = (url, token) =>
	fetch(url, {
		method: 'GET',
		headers: new Headers({ 'Content-Type': 'application/json', token }),
		credentials: 'same-origin',
	}).then((res) => res.json())

export async function getServerSideProps({ req }) {
	// console.log('getServerSideProps req: ', req)
	const { user } = await supabase.auth.api.getUserByCookie(req)
	console.log('[index] getServerSideProps user: ', user)
	if (user) {
		// If no user, redirect to index.
		return { props: {}, redirect: { destination: '/euro2020', permanent: false } }
	}

	// If there is a user, return it.
	return { props: { user } }
}

export default function index() {
	const classes = useStyles()
	const router = useRouter()
	const { user, session } = Auth.useUser()
	const [showLoginForm, setShowLoginForm] = useState(true)

	const { data, error } = useSWR(session ? ['/api/getUser', session.access_token] : null, fetcher)
	const [authView, setAuthView] = useState('sign_in')

	// useEffect(() => {
	// console.log('useEffect user.id: ', user?.id)
	// 	if (user) {
	// 		console.log('Redirect to /fixtures')
	// 	}
	// }, [])

	useEffect(() => {
		const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
			console.log('[index] onAuthStateChange event: ', event)
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
			// .then(() => {
			// 	if (event === 'SIGNED_IN') {
			// 		router.push('/fixtures')
			// 	}
			// })
		})

		return () => {
			authListener.unsubscribe()
		}
	}, [])

	return (
		<>
			<Head>
				<title>Home - TIF</title>
			</Head>
			<Grid container component="main" className={classes.root}>
				<CssBaseline />

				<Grid item xs={false} sm={4} md={7} className={classes.image}>
					<Grid container spacing={0} direction="column" alignItems="center" justify="center" style={{ minHeight: '100vh' }}>
						<Grid item xs={3}>
							<Link href="/euro2020" passHref>
								<Button component="a" variant="contained" color="primary">
									enter as guest
                                </Button>
							</Link>
						</Grid>
					</Grid>
					<Grid container justify="center" alignItems="flex-end">
						<p>Last deployment time: Monday April 27, 00:34.</p>
					</Grid>
				</Grid>
				<Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
					{/* {user ? <div>You are logged in!</div> : ( */}
					{showLoginForm ? <Login setShowLoginForm={setShowLoginForm} /> :
						<Register setShowLoginForm={setShowLoginForm} />
					}
					{/* )} */}
				</Grid>
			</Grid>
		</>
	)
}
