// import { supabase } from '../../../utils/supabaseClient'
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

export default async function fetchLeagueTeams(req, res) {
    try {
        // 1) Request data from Football API
        const teams = await fetch('https://v3.football.api-sports.io/teams?league=4&season=2020', {
            method: 'GET',
            headers: {
                'x-apisports-key': process.env.API_FOOTBALL_KEY,
            },
        })
        const { response } = await teams.json()

        console.log('response.length: ', response.length)

        let array = []
        for (let i = 0; i < response.length; i++) {
            array.push({
                api_football_id: response[i]['team']['id'],
                name: response[i]['team']['name'],
                country: response[i]['team']['country'],
                national: response[i]['team']['national'],
                logo: response[i]['team']['logo'],
            })
        }
        console.log('array: ', array)
        const { data, error } = await supabase.from('teams').upsert(array)

        return res.status(200).json({ success: true, length: response.length, data: response })
    } catch (error) {
        return res.status(500).json('An error occured on the server: ', error)
    }
}
