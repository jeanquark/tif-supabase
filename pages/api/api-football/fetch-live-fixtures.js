// import { supabase } from "../../../utils/supabaseClient"
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

export default async function fetchNextFixtures(req, res) {
    try {
        // 1) Request data from Football API
        const data = await fetch("https://v3.football.api-sports.io/fixtures?league=652&live=all", {
            "method": "GET",
            "headers": {
                "x-rapidapi-key": process.env.API_FOOTBALL_KEY,
                "x-rapidapi-host": "v3.football.api-sports.io",
                "useQueryString": true
            }
        })
        const { response } = await data.json()

        console.log('response.length: ', response.length)

        // 2) Update DB
        let array = []
        for (let i = 0; i < response.length; i++) {
            array.push({
                fixture_id: response[i]['fixture']['id'],
                home_team_score: response[i]['goals']['home'],
                visitor_team_score: response[i]['goals']['away']
            })
        }
        console.log('array: ', array)
        // const { data, error } = await supabase
        //     .from('events').upsert(array, { onConflict: 'fixture_id'})

        return res.status(200).json({ success: true, array })
        return res.status(200).json({ success: true, length: response.length, data: response });
    } catch (error) {
        return res.status(500).json('An error occured on the server: ', error);

    }

}