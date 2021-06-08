import React from 'react'
import useSWR from 'swr'
import { Auth } from '@supabase/ui'
import { supabase } from '../lib/initSupabase'
import { useEffect, useState, useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Login from '../components/Login'
import Register from '../components/Register'
import ForgotPassword from '../components/ForgotPassword'
import ResetPassword from '../components/ResetPassword'
import Snackbar from '../components/Snackbar'
import SnackbarContext from '../store/snackbarContext'

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
import { RestaurantTwoTone } from '@material-ui/icons'


const useStyles = makeStyles((theme) => ({
	root: {
		height: '100vh',
	},
	image: {
		// backgroundImage: 'url(https://source.unsplash.com/random)',
		// backgroundImage: 'url(/images/avatar-transparent.png)',
		backgroundImage: 'url(/images/avatar.svg)',
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
	const { data, error } = useSWR(session ? ['/api/getUser', session.access_token] : null, fetcher) 
	const [authView, setAuthView] = useState('sign_in')
	const [showLoginForm, setShowLoginForm] = useState(true)
	const { snackbar, setSnackbar } = useContext(SnackbarContext)
	const [open, setOpen] = useState(false);
	// const [snackbar, setSnackbar] = useState({ open: false })
	const [form, setForm] = useState('')
	
	
	useEffect(() => {
		// Get url params to check for password recovery
		const hash = window.location.hash.substr(1);
		console.log('hash: ', hash)
		if (hash) {
			var result = hash.split('&').reduce(function (res, item) {
				var parts = item.split('=');
				res[parts[0]] = parts[1];
				return res;
			}, {});
			console.log('result: ', result)
			const { type, access_token, error_code, error_description } = result
			console.log('type: ', type)
			console.log('access_token: ', access_token)
			console.log('error_code: ', error_code)
			console.log('error_description: ', error_description)
		}
	}, [])

	useEffect(() => {
		// const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
		// 	console.log('[index] onAuthStateChange event: ', event)
		// 	// if (event === 'PASSWORD_RECOVERY') setAuthView('update_password')
		// 	// if (event === 'USER_UPDATED') setTimeout(() => setAuthView('sign_in'), 1000)
		// 	// Send session to /api/auth route to set the auth cookie.
		// 	// NOTE: this is only needed if you're doing SSR (getServerSideProps)!
		// 	fetch('/api/auth', {
		// 		method: 'POST',
		// 		headers: new Headers({ 'Content-Type': 'application/json' }),
		// 		credentials: 'same-origin',
		// 		body: JSON.stringify({ event, session }),
		// 	})
		// 	.then((res) => res.json())
		// 	// .then(() => {
		// 	// 	if (event === 'SIGNED_IN') {
		// 	// 		router.push('/fixtures')
		// 	// 	}
		// 	// })
		// })

		setSnackbar({
			open: true,
			message: 'Welcome to ThisIsFan!',
			severity: 'success'
		})

		// return () => {
		// 	authListener.unsubscribe()
		// }
	}, [])

	function showForm () {
		switch (form) {
			case 'login':
				return <Login setForm={setForm} redirectTo={"/euro2020"} />
				break
			case 'register':
				return <Register setForm={setForm} />
				break
			case 'forgot-password':
				return <ForgotPassword setForm={setForm} />
				break
			case 'reset-password':
				return <ResetPassword setForm={setForm} />
				break
			default:
				return <Login setForm={setForm} redirectTo={"/euro2020"} />
		}
	}

	return (
		<>
			<Head>
				<title>TIF - Home</title>
			</Head>
			<Grid container component="main" className={classes.root}>
				<CssBaseline />

				<Grid item xs={false} sm={4} md={7} className={classes.image}>
					<Grid container spacing={0} direction="column" alignItems="center" justify="center" style={{ minHeight: '100vh' }}>
						<Grid item xs={3} style={{ paddingBottom: 0 }}>
							<Link href="/euro2020" passHref>
								<Button component="a" variant="contained" color="primary" size="large">
									enter as guest
                                </Button>
							</Link>
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
					{showForm()}
				</Grid>
			</Grid>
		</>
	)
}
