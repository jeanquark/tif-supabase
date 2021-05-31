import { useState, useEffect } from 'react'
import { supabase } from '../lib/initSupabase'
import Link from 'next/link'

export default function Events() {
    const [events, setEvents] = useState([])
    useEffect(() => {
        fetchEvents();
    }, [])

    const fetchEvents = async () => {
        let { data: events, error } = await supabase.from('events').select('*').order('id', true)
        if (error) console.log('error', error)
        else setEvents(events)
    }
    return (
        <div>
            <h3>Events:</h3>
            <div className="card">
                <ul>
                    {events.map((event) => (
                        <li key={event.id}>
                            <Link href={`/events/${event.id}`}>
                                <a>
                                    {event.home_team_name} - {event.visitor_team_name}
                                </a>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

