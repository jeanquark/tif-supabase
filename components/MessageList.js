import { useState, useEffect } from 'react'
import { useRef } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/initSupabase'
import { makeStyles } from '@material-ui/core/styles'
import { Auth } from '@supabase/ui'
import Link from 'next/link'
import Moment from 'react-moment'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import FormGroup from '@material-ui/core/FormGroup'
import FormControl from '@material-ui/core/FormControl'
import Box from '@material-ui/core/Box'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import { HowToVoteRounded } from '@material-ui/icons'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    container: {
        paddingLeft: theme.spacing(5),
        paddingRight: theme.spacing(5),
    },
    button: {
        verticalAlign: 'text-top',
        '&:hover': {
            color: '#000',
            cursor: 'pointer',
        },
    },
}))

export default function Messages() {
    const router = useRouter()
    const classes = useStyles()
    const { id } = router.query
    const { user, session } = Auth.useUser()
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const [newMessage, handleNewMessage] = useState('')
    const [deletedMessage, handleDeletedMessage] = useState('')
    const [error, setError] = useState('')
    const [loadingInitial, setLoadingInitial] = useState(true)
    const [isSending, setIsSending] = useState(false)
    const messagesEndRef = useRef(null)
    let mySubscription = null
    // const [hovered, setHovered] = useState(false)
    useEffect(() => {
        if (newMessage) {
            // console.log("newMessage :>> ", newMessage);
            console.log('newMessage: ', newMessage)
            setMessages((m) => [...m, newMessage])
            scrollToBottom()
        }
    }, [newMessage])

    useEffect(() => {
        if (deletedMessage) {
            // console.log("newMessage :>> ", newMessage);
            console.log('deletedMessage useEffect: ', deletedMessage)
        }
    }, [deletedMessage])

    const getInitialMessages = async () => {
        if (!messages.length) {
            const { data, error } = await supabase.from(`messages`).select().eq('event_id', id).order('id', { ascending: true })

            setLoadingInitial(false)
            if (error) {
                setError(error.message)
                supabase.removeSubscription(mySubscription)
                mySubscription = null
                return
            }
            setMessages(data)
        }
    }
    const getMessagesAndSubscribe = async () => {
        setError('')
        getInitialMessages()
        console.log('getMessagesAndSubscribe')
        if (!mySubscription) {
            mySubscription = supabase
                .from(`messages:event_id=eq.${id}`)
                .on('*', (payload) => {
                    console.log('getMessagesAndSubscribe payload: ', payload)
                    handleNewMessage(payload.new)
                })
                .subscribe()
        } else {
            console.log('Delete message')
        }
    }
    useEffect(() => {
        // console.log("useSupabase() effect ran!");
        getMessagesAndSubscribe()
        return () => {
            supabase.removeSubscription()
            console.log('Remove supabase subscription by useEffect unmount')
        }
    }, [id])
    // useEffect(() => {
    //     fetchMessages(id)
    // }, [id])
    // useEffect(() => {
    //     scrollToBottom()
    // }, [messages])
    // useEffect(() => {
    //     supabase
    //         .from(`messages:event_id=eq.${id}`)
    //         .on('INSERT', (message) => {
    //             if (message.new) {
    //                 console.log('message.new: ', message.new)
    //                 setMessages([...messages, message.new])
    //                 console.log('messages2: ', messages)
    //             }
    //         })
    //         .subscribe()
    // }, [messages, setMessages])

    useEffect(() => {
        supabase
            .from('messages')
            .on('DELETE', (payload) => {
                console.log('payload: ', payload)
                const newMessagesList = messages.filter((item) => item.id !== payload.old.id)
                console.log('newMessagesList: ', newMessagesList)
                setMessages(newMessagesList)
            })
            .subscribe()
    }, [messages, setMessages])

    const scrollToBottom = () => {
        console.log('scrollToBottom')
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    // const fetchMessages = async (id) => {
    //     let { data: messages, error } = await supabase.from('messages').select('*').eq('event_id', id)
    //     if (error) {
    //         console.log('error', error)
    //     } else {
    //         console.log('messages: ', messages)
    //         setMessages(messages)
    //     }
    // }
    // const subscribeMessages = async () => {}

    // const unsubscribeMessages = async () => {
    //     supabase.removeSubscription(messages)
    // }

    // const sendMessage2 = async (event) => {
    //     event.preventDefault()
    //     console.log('sendMessage: ', event)
    //     console.log('sendMessage event.target.message.value: ', event.target.message.value)
    //     const { data, error } = await supabase.from('messages').insert([{ content: event.target.message.value, event_id: id, user_id: user?.id, user_email: user?.email }])
    //     if (error) {
    //         alert(error.message)
    //         return
    //     }
    //     console.log('data: ', data)
    //     event.target.message.value = ''
    //     scrollToBottom()
    // }

    const sendMessage = async (e) => {
        e.preventDefault()
        setIsSending(true)
        if (!message) return
        try {
            const { data, error } = await supabase.from('messages').insert([{ content: message, event_id: id, user_id: user?.id, user_email: user?.email }])

            if (error) {
                alert(error.message)
                return
            }
            console.log('Successfully sent!')
            setMessage('')
        } catch (error) {
            console.log('error sending message:', error)
        } finally {
            setIsSending(false)
            scrollToBottom()
        }
    }

    const deleteMessage = async (messageId, messageUserEmail) => {
        console.log('deleteMessage: ', messageId, messageUserEmail)
        if (messageUserEmail && messageUserEmail != user?.email) {
            return alert('You cannot delete a message that is not yours.')
        }
        const { data, error } = await supabase.from('messages').delete().match({ id: messageId })
        console.log('data: ', data)
        console.log('error: ', error)
        console.log('mySubscription: ', mySubscription)
    }

    return (
        <>
            <h1 style={{ textAlign: 'center' }}>Chatroom:</h1>
            <br />
            <Box style={{ maxHeight: '250px', overflow: 'auto' }}>
                {messages.map((message) => (
                    <Box key={message.id} ml={user?.id === message.user_id ? 0 : 6} mr={user?.id === message.user_id ? 6 : 0}>
                        <Paper elevation={3} style={{ margin: 10, padding: 8 }}>
                            {message.content}
                            <br />
                            <Box display="flex" flexDirection="row-reverse">
                                {(message.user_id === user?.id || !message.user_id) &&
                                    <DeleteIcon color="error" className={classes.button} onClick={(e) => deleteMessage(message.id, message.user_email)} />
                                }
                                <i>
                                    {message?.user_email?.split('@')[0] || 'anonymous'}&nbsp;<Moment format="HH:mm">{message.inserted_at}</Moment>
                                </i>
                            </Box>
                        </Paper>
                    </Box>
                ))}
                <div ref={messagesEndRef} />
            </Box>
            <Box mt={3} mx={1}>
                <form onSubmit={sendMessage}>
                    <Grid container spacing={10}>
                        <Grid className="d-flex" style={{ display: 'flex' }} item form="maincomponent" xs>
                            <TextField id="message" label="Your message" fullWidth value={message} onChange={(e) => setMessage(e.target.value)} />
                            <Button type="submit" variant="contained" color="primary" size="small" disabled={!message}>
                                Send
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </>
    )
}
