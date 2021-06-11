import React from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import theme from '../src/theme'
import Snackbar from '../components/Snackbar'
import Modal from '../components/Modal'
import { Auth } from '@supabase/ui'
import { supabase } from '../lib/initSupabase'
import { appWithTranslation } from 'next-i18next'
import { UserContextProvider } from '../store/userContext'
import { EventsContextProvider } from '../store/eventsContext'
import { ActionsContextProvider } from '../store/actionsContext'
import { ModalContextProvider } from '../store/modalContext'
import { DialogContextProvider } from '../store/dialogContext'
import { SnackbarContextProvider } from '../store/snackbarContext'

const MyApp = (props) => {
    const { Component, pageProps } = props
    // const { user, session } = Auth.useUser()

    React.useEffect(() => {
        console.log('[useEffect] _app.js')

        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side')
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles)
        }
    }, [])

    // React.useEffect(() => {console.log('[useEffect] _app.js user: ', user)}, [user])

    return (
        <React.Fragment>
            <Head>
                <title>ThisIsFan</title>
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
            </Head>
            <Auth.UserContextProvider supabaseClient={supabase}>
                <ThemeProvider theme={theme}>
                    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                    <CssBaseline />
                    <UserContextProvider supabase={supabase}>
                        <ModalContextProvider>
                            <DialogContextProvider>
                                <SnackbarContextProvider>
                                    <EventsContextProvider>
                                        <ActionsContextProvider>
                                            <Component {...pageProps} />
                                            <Modal />
                                            <Snackbar />
                                        </ActionsContextProvider>
                                    </EventsContextProvider>
                                </SnackbarContextProvider>
                            </DialogContextProvider>
                        </ModalContextProvider>
                    </UserContextProvider>
                </ThemeProvider>
            </Auth.UserContextProvider>
        </React.Fragment>
    )
}

MyApp.propTypes = {
    Component: PropTypes.elementType.isRequired,
    pageProps: PropTypes.object.isRequired,
}

export default appWithTranslation(MyApp)
