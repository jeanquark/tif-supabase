import React from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import theme from '../src/theme'
import Snackbar from '../components/Snackbar'
import { Auth } from '@supabase/ui'
import { supabase } from '../lib/initSupabase'
import { UserContextProvider } from '../store/userContext'
import { EventsContextProvider } from '../store/eventsContext'
import { ActionsContextProvider } from '../store/actionsContext'
import { SnackbarContextProvider } from '../store/snackbarContext'

export default function MyApp(props) {
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
                        <SnackbarContextProvider>
                            <EventsContextProvider>
                                <ActionsContextProvider>
                                    <Component {...pageProps} />
                                    <Snackbar />
                                </ActionsContextProvider>
                            </EventsContextProvider>
                        </SnackbarContextProvider>
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
