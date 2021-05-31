import Head from 'next/head'
import Link from 'next/link'
import { makeStyles } from '@material-ui/core/styles'
import { Container } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Navbar from '../components/Navbar'

const useStyles = makeStyles((theme) => ({
	container: {
		paddingLeft: theme.spacing(5),
		paddingRight: theme.spacing(5),
	},
}))

export default function Test() {
	const classes = useStyles()

	const fetchEuro2020Fixtures = async () => {
		try {
			console.log('fetchEuro2020Fixtures')
			const res = await fetch(`/api/api-football/fetch-euro2020-fixtures`)
			const data = await res.json()

			if (!data) {
				console.log('no data')
			}
			console.log('data: ', data)
		} catch (error) {
			console.log('error: ', error)
		}
	}
	const fetchLiveScore = async () => {
		try {
			console.log('fetchLiveScore')
			const res = await fetch(`/api/api-football/fetch-live-fixtures`)
			const data = await res.json()

			if (!data) {
				console.log('no data')
			}
			console.log('data: ', data)
		} catch (error) {
			console.log('error: ', error)
		}
	}

	return (
		<>
			<Head>
				<title>Fixtures</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Navbar title={'Test'} links={['fixtures', 'actions']} />

			<Container className={classes.container}>
				<Button variant="contained" color="secondary" size="small" onClick={() => fetchEuro2020Fixtures()}>Fetch Euro 2020 fixtures</Button>
				<Button variant="contained" color="primary" size="small" onClick={() => fetchLiveScore()}>Fetch Live Score</Button>
			</Container>
		</>
	)
}
