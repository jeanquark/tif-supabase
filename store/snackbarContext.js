import { createContext, useState, useEffect } from 'react'

const SnackbarContext = createContext({});

export function SnackbarContextProvider(props) {
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info'
    })

    async function setSnackbarHandler() {
        console.log('[snackbarContext] setSnackbarHandler')
    }

    const context = {
        snackbar,
        setSnackbar
    };

    return (
        <SnackbarContext.Provider value={context}>
            {props.children}
        </SnackbarContext.Provider>
    );
}

export default SnackbarContext;