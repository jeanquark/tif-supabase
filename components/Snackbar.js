import React from 'react'
import { useState, useEffect, useContext } from 'react'
import Button from '@material-ui/core/Button'
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import MuiAlert from '@material-ui/lab/Alert'
import SnackbarContext from '../store/snackbarContext'

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function SimpleSnackbar() {
    const { snackbar, setSnackbar } = useContext(SnackbarContext)

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }
        setSnackbar({ open: false })
    }

    return (
        <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={snackbar.severity}>
                {snackbar.message}
            </Alert>
        </Snackbar>
    )
}
