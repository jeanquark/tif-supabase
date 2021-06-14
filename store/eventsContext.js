import { createContext, useState, useEffect } from 'react'
import { supabase } from '../lib/initSupabase'

const EventsContext = createContext({
    events: []
});

export function EventsContextProvider(props) {
    const [events, setEvents] = useState([]);

    useEffect(async () => {
        console.log('[eventsContext] useEffect EventsContextProvider')
        if (events.length < 1) {
            fetchEvents()
        }
    }, [])

    async function fetchEvents() {
        console.log('[eventsContext] fetchEvents FETCH DATA FROM DB!!')
        const { data, error } = await supabase.from('events').select('*').order('id', true)
            console.log('data: ', data)
            if (error) console.log('error: ', error)
            else setEvents(data)
    }

    // async function setEventsHandler(event) {
    //     console.log('[eventsContext] setEventsHandler FETCH DATA FROM DB!!')
    //     console.log('[eventsContext] event: ', event)

    //     const { data, error } = await supabase.from('events').select('*').order('id', true)
    //         console.log('data: ', data)
    //         if (error) console.log('error: ', error)
    //         else setEvents(data)
    // }

    const context = {
        events,
        // setEvents: setEventsHandler
        setEvents
    };

    return (
        <EventsContext.Provider value={context}>
            {props.children}
        </EventsContext.Provider>
    );
}

export default EventsContext;