import { useEffect, useState, useContext } from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContext from '../store/dialogContext'
import Login from './Login'

export default function FormDialog() {
    // const [open, setOpen] = useState(false)
    const { dialog, setDialog } = useContext(DialogContext)

    const handleClickOpen = () => {
        setDialog({open: true})
    }

    const handleClose = () => {
        setDialog({open: false})
    }

    return (
        <div>
            {/* <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Open form dialog
      </Button> */}
            <Dialog open={dialog.open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
                <DialogContent>
                    <DialogContentText>To subscribe to this website, please enter your email address here. We will send updates occasionally.</DialogContentText>
                    <TextField autoFocus margin="dense" id="name" label="Email Address" type="email" fullWidth />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleClose} color="primary">
                        Subscribe
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
