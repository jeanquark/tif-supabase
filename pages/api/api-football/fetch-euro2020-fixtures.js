import slugify from 'slugify'
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

export default async function fetchNextFixtures(req, res) {
    try {
        // 1) Request data from Football API
        // const data = await fetch("https://api-football-v1.p.rapidapi.com/v3/fixtures?from=2021-06-01&to=2021-07-31&league=4&season=2020", {
        const data2 = await fetch("https://v3.football.api-sports.io/fixtures?from=2021-06-01&to=2021-07-31&league=4&season=2020", {
            "method": "GET",
            "headers": {
                "x-apisports-key": process.env.API_FOOTBALL_KEY
            }
        })
        const { response } = await data2.json()
        // console.log('[api/api-football/fetchNextFixtures] response: ', response);
        let array = []
        let group = ''
        let venueSlug = ''
        const teamGroupHashObject = {
            1: 'B', // Belgium
            2: 'F', // France
            3: 'D', // Croatia
            4: 'B', // Russia
            5: 'E', // Sweden
            9: 'E', // Spain
            10: 'D', // England
            15: 'A', // Switzerland
            21: 'B', // Denmark
            24: 'E', // Poland
            25: 'F', // Germany
            27: 'F', // Portugal
            767: 'A', // Wales
            768: 'A', // Italy
            769: 'F', // Hungary
            770: 'D', // Czech Republic
            772: 'C', // Ukraine
            773: 'E', // Slovakia
            775: 'C', // Austria
            777: 'A', // Turkey
            1105: 'C', // FYR Macedonia
            1099: 'B', // Finland
            1108: 'D', // Scotland
            1118: 'C' // Netherlands
        }
        for (let i = 0; i < response.length; i++) {
            if (response[i]['league']['round'].startsWith('Group')) {
                // console.log('yes!')
                group = teamGroupHashObject[response[i]['teams']['home']['id']]
            } else {
                group = null
            }
            venueSlug = slugify(response[i]['fixture']['venue']['name'] || '', { lower: true })
            array.push({
                fixture_id: response[i]['fixture']['id'],
                home_team_id: response[i]['teams']['home']['id'],
                home_team_name: response[i]['teams']['home']['name'],
                home_team_image: `${response[i]['teams']['home']['id']}.png`,
                visitor_team_id: response[i]['teams']['away']['id'],
                visitor_team_name: response[i]['teams']['away']['name'],
                visitor_team_image: `${response[i]['teams']['away']['id']}.png`,
                venue_id: response[i]['fixture']['venue']['id'],
                venue_name: response[i]['fixture']['venue']['name'],
                venue_slug: venueSlug,
                city: response[i]['fixture']['venue']['city'],
                date: response[i]['fixture']['date'],
                timestamp: response[i]['fixture']['timestamp'],
                league_id: response[i]['league']['id'],
                round: response[i]['league']['round'],
                group_name: group
            })
        }
        console.log('[api/api-football/fetchNextFixtures] array: ', array)

        // 2) Load DB
        console.log('[api/api-football/fetchNextFixtures] response.length: ', response.length);
        const { data, error } = await supabase
            .from('events').upsert(array, { onConflict: 'fixture_id'})
        console.log('[api/api-football/fetchNextFixtures] data: ', data)
        console.log('[api/api-football/fetchNextFixtures] error: ', error)

        return res.status(200).json({ success: true, length: response.length });
    } catch (error) {
        console.log(error)
        return res.status(500).json('An error occured on the server: ', error.response.data);

    }

}