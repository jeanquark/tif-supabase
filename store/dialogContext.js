import { createContext, useState, useEffect } from 'react'

const DialogContext = createContext({});

export function DialogContextProvider(props) {
    const [dialog, setDialog] = useState({
        open: false,
        type: '',
        redirectTo: ''
    })

    async function setDialogHandler() {
        console.log('[dialogContext] setDialogHandler')
    }

    const context = {
        dialog,
        setDialog
    };

    return (
        <DialogContext.Provider value={context}>
            {props.children}
        </DialogContext.Provider>
    );
}

export default DialogContext;