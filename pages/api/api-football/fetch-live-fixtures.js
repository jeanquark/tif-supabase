// import { supabase } from "../../../utils/supabaseClient"
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

export default async function fetchNextFixtures(req, res) {
    try {
        // // 0) Test events
        // const data = await fetch('https://v3.football.api-sports.io/fixtures?live=all', {
        //     method: 'GET',
        //     headers: {
        //         'x-rapidapi-key': process.env.API_FOOTBALL_KEY,
        //         'x-rapidapi-host': 'v3.football.api-sports.io',
        //         useQueryString: true,
        //     }
        // })
        // const { response } = await data.json()

        // let array = []
        // for (let i = 0; i < response.length; i++) {
        //     array.push({
        //         fixture_id: response[i]['fixture']['id'],
        //         home_team_score: response[i]['goals']['home'],
        //         visitor_team_score: response[i]['goals']['away'],
        //         events: response[i]['events']
        //     })
        // }
        // // console.log('array: ', array)
        // const { error } = await supabase.from('events:league_id=eq.4').upsert({ home_team_score: 1 })
        // // const { error } = await supabase
        // //     .from('events')
        // //     .insert([
        // //         { fixture_id: '998', events: array[0]['events'] }
        // //     ])
        // console.log('error: ', error)

        // return res.status(200).json({ success: true, array })


        // 1) Request data from Football API
        const data = await fetch('https://v3.football.api-sports.io/fixtures?league=4&live=all', {
            method: 'GET',
            headers: {
                'x-rapidapi-key': process.env.API_FOOTBALL_KEY,
                'x-rapidapi-host': 'v3.football.api-sports.io',
                useQueryString: true,
            },
        })
        const { response } = await data.json()

        console.log('response.length: ', response.length)

        // 2) Update DB
        let array = []
        for (let i = 0; i < response.length; i++) {
            array.push({
                fixture_id: response[i]['fixture']['id'],
                home_team_score: response[i]['goals']['home'],
                visitor_team_score: response[i]['goals']['away'],
                events: response[i]['events']
            })
        }
        console.log('array: ', array)
        const { error } = await supabase.from('events').upsert(array, { onConflict: 'fixture_id' })
        console.log('error: ', error)

        return res.status(200).json({ success: true, array })
    } catch (error) {
        return res.status(500).json('An error occured on the server: ', error)
    }
}
