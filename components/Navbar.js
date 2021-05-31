import React from 'react'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useState, useEffect, useContext } from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { Auth } from '@supabase/ui'
import { supabase } from '../lib/initSupabase'
import Drawer from '@material-ui/core/Drawer'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import CssBaseline from '@material-ui/core/CssBaseline'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import LoyaltyIcon from '@material-ui/icons/Loyalty'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import PeopleIcon from '@material-ui/icons/People'
import SportsSoccerIcon from '@material-ui/icons/SportsSoccer'
import Avatar from '@material-ui/core/Avatar'
import Badge from '@material-ui/core/Badge'
import Box from '@material-ui/core/Box'
import AccountCircle from '@material-ui/icons/AccountCircle'
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle'
// import { useTestContext } from '../store/test-context'
// import { useUserContext } from '../store/userContext'
import UserContext from '../store/userContext'

const drawerWidth = 240

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex'
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
	},
	appBarShift: {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	menuButton: {
		marginRight: 36,
	},
	title: {
		flexGrow: 1,
	},
	hide: {
		display: 'none',
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0,
		whiteSpace: 'nowrap',
	},
	drawerOpen: {
		width: drawerWidth,
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	drawerClose: {
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		overflowX: 'hidden',
		width: theme.spacing(7) + 1,
		[theme.breakpoints.up('sm')]: {
			width: theme.spacing(7) + 1,
		},
	},
	toolbar: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-end',
		padding: theme.spacing(0, 1),
		// necessary for content to be below app bar
		...theme.mixins.toolbar,
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3),
	},
	small: {
		width: theme.spacing(3),
		height: theme.spacing(3),
	}
}))

export default function Navbar() {
	const router = useRouter()
	const classes = useStyles()
	const theme = useTheme()
	const [open, setOpen] = React.useState(false)
	const [anchorEl, setAnchorEl] = React.useState(null)
	// const { user, session } = Auth.useUser()
	// const user = useUserContext()
	const { user } = useContext(UserContext)
	const openAnchorEl = Boolean(anchorEl)

	const handleMenu = (event) => {
		setAnchorEl(event.currentTarget)
	}
	const handleClose = () => {
		setAnchorEl(null)
	}

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

	const handleDrawerOpen = () => {
		setOpen(true)
	}

	const handleDrawerClose = () => {
		setOpen(false)
	}

	const handleLogout = async () => {
		console.log('handleLogout')
		let { error } = await supabase.auth.signOut()
		if (error) {
			console.log('error: ', error)
			return
		}
		router.push('/')
	}

	return (
		<div className={classes.root}>
			<CssBaseline />
			<AppBar
				position="fixed"
				className={clsx(classes.appBar, {
					[classes.appBarShift]: open,
				})}
			>
				<Toolbar>
					<IconButton
						color="inherit"
						aria-label="open drawer"
						onClick={handleDrawerOpen}
						edge="start"
						className={clsx(classes.menuButton, {
							[classes.hide]: open,
						})}
					>
						<MenuIcon />
					</IconButton>
					<Typography variant="h6" noWrap className={classes.title}>
						ThisIsFan
					</Typography>
					{user && <>
						<Box mx={2}>
							<Badge badgeContent={user?.points} max={100} color="secondary">
								<LoyaltyIcon />
							</Badge>
						</Box>
						<IconButton
							aria-label="account of current user"
							aria-controls="menu-appbar"
							aria-haspopup="true"
							color="secondary"
							onClick={handleMenu}
						>
							<Avatar alt={user.email} src="/images/avatar.png" />
						</IconButton>
						<Menu
							id="menu-appbar"
							anchorEl={anchorEl}
							anchorOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							open={openAnchorEl}
							onClose={handleClose}
						>
							{/* <MenuItem>Profile</MenuItem> */}
							{/* <MenuItem>My account</MenuItem> */}
							<MenuItem onClick={handleLogout}>Logout</MenuItem>
						</Menu>
					</>}
				</Toolbar>
			</AppBar>
			<div className={classes.appBarSeparator} />
			<Drawer
				variant="permanent"
				className={clsx(classes.drawer, {
					[classes.drawerOpen]: open,
					[classes.drawerClose]: !open,
				})}
				classes={{
					paper: clsx({
						[classes.drawerOpen]: open,
						[classes.drawerClose]: !open,
					}),
				}}
			>
				<div className={classes.toolbar}>
					<IconButton onClick={handleDrawerClose}>{theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}</IconButton>
				</div>
				<Divider />
				<List>
					{user && <ListItem>
						<ListItemIcon>
							<Avatar alt={user.email} src="/images/avatar.png" className={classes.small} />
						</ListItemIcon>
						<ListItemText><Button variant="outlined" color="primary" size="small" onClick={handleLogout}>Logout</Button></ListItemText>
					</ListItem>}
					<Link href="/" passHref>
						<ListItem button component="a">
							<ListItemIcon>
								<SportsSoccerIcon />
							</ListItemIcon>
							<ListItemText primary="Games" />
						</ListItem>
					</Link>
					<Link href="/euro2020" passHref>
						<ListItem button component="a">
							<ListItemIcon>
								<PeopleIcon />
							</ListItemIcon>
							<ListItemText primary="Players" />
						</ListItem>
					</Link>
				</List>
				<Divider />
			</Drawer>
		</div>
	)
}
