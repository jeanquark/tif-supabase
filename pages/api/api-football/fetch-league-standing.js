// import { supabase } from '../../../utils/supabaseClient'
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

export default async function fetchLeagueTeams(req, res) {
    try {
        // 1) Request data from Football API
        const standings = await fetch('https://v3.football.api-sports.io/standings?league=4&season=2020', {
            method: 'GET',
            headers: {
                'x-apisports-key': process.env.API_FOOTBALL_KEY,
            },
        })
        const { response } = await standings.json()

        console.log('response.length: ', response.length)
        // console.log('response[0][league]: ', response[0]['league'])
        console.log('response[0][league][standings]: ', response[0]['league']['standings'])

        let array = []
        for (let i = 0; i < response[0]['league']['standings'].length; i++) {
            for (let j = 0; j < response[0]['league']['standings'][i].length; j++) {
                if (!array.find(a => a.team_id === response[0]['league']['standings'][i][j]['team']['id'])) {
                    array.push({
                        league_id: response[0]['league']['id'],
                        rank: response[0]['league']['standings'][i][j]['rank'],
                        team_id: response[0]['league']['standings'][i][j]['team']['id'],
                        team_name: response[0]['league']['standings'][i][j]['team']['name'],
                        points: response[0]['league']['standings'][i][j]['points'],
                        goals_diff: response[0]['league']['standings'][i][j]['goalsDiff'],
                        group_name: response[0]['league']['standings'][i][j]['group'],
                        description: response[0]['league']['standings'][i][j]['description'],
                        all_played: response[0]['league']['standings'][i][j]['all']['played'],
                        all_win: response[0]['league']['standings'][i][j]['all']['win'],
                        all_draw: response[0]['league']['standings'][i][j]['all']['draw'],
                        all_lose: response[0]['league']['standings'][i][j]['all']['lose'],
                        all_goals_for: response[0]['league']['standings'][i][j]['all']['goals']['for'],
                        all_goals_against: response[0]['league']['standings'][i][j]['all']['goals']['against']
                    })
                }
                
            }
        }
        console.log('array: ', array)
        const { data, error } = await supabase.from('standings').upsert(array)
        console.log('error: ', error)
        console.log('data: ', data)

        return res.status(200).json({ success: true, length: response.length, data: response })
    } catch (error) {
        return res.status(500).json('An error occured on the server: ', error)
    }
}
