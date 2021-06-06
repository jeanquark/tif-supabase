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
import Modal from '@material-ui/core/Modal'
import ModalContext from '../store/modalContext'
import Login from './Login'
import Register from './Register'
import ForgotPassword from './ForgotPassword'
import ResetPassword from './ResetPassword'

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 600,
        maxHeight: 500,
        overflow: 'auto',
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}))

function rand() {
    return Math.round(Math.random() * 20) - 10
}

function getModalStyle() {
    const top = 50 + rand()
    const left = 50 + rand()

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    }
}

export default function SimpleModal(props) {
    const classes = useStyles()
    // const router = useRouter()
    // const [errors, setErrors] = useState({
    //     password: {
    //         show: false,
    //         message: '',
    //     },
    // })
    // const userContext = useContext(UserContext)
    const [modalStyle] = useState(getModalStyle)
    // const [open, setOpen] = useState(false)
    const { modal, setModal } = useContext(ModalContext)
    const [form, setForm] = useState('reset-password')

    const handleOpen = () => {
        setModal({ open: true })
    }

    const handleClose = () => {
        setModal({ open: false })
    }

    // const body = (
    //     <div style={modalStyle} className={classes.paper}>
    //         <h2 id="simple-modal-title">Text in a modal</h2>
    //         <p id="simple-modal-description">Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</p>
    //         {/* <SimpleModal /> */}
    //     </div>
    // )
    
    function showForm () {
		switch (form) {
			case 'login':
				return <Login modal={true} redirectTo={modal.redirectTo} setForm={setForm} />
				break
			case 'register':
				return <Register modal={true} setForm={setForm} />
				break
			case 'forgot-password':
				return <ForgotPassword modal={true} setForm={setForm} />
				break
			case 'reset-password':
				return <ResetPassword setForm={setForm} />
				break
			default:
				return <Login modal={true} setForm={setForm} />
		}
	}

    function modalContent() {
        switch (modal.type) {
            case 'login':
                return (
                    <div style={modalStyle} className={classes.paper}>
                        {/* <Login dialog={true} setForm={setForm} /> */}
                        {showForm()}
                    </div>
                )
            default:
                return (
                    <div style={modalStyle} className={classes.paper}>
                        <h2 id="simple-modal-title">Default modal</h2>
                        <p id="simple-modal-description">Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</p>
                    </div>
                )
        }
    }

    return (
        <Modal open={modal.open} onClose={handleClose} aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description">
            {/* {body} */}
            {modalContent()}
        </Modal>
    )
}
