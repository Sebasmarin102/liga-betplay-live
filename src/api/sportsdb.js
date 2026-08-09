import { formatDate, addDays } from "../utils/date"

const API_KEY = import.meta.env.VITE_SPORTSDB_KEY
const LEAGUE_ID = import.meta.env.VITE_COLOMBIA_LEAGUE_ID
const SEASON = import.meta.env.VITE_SEASON
const BASE_URL = 'https://www.thesportsdb.com/api/v1/json'

async function fetchJson(url) {
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error(`Error de red: ${response.status}`)
    }
    return response.json()
}

export async function getFixturesByDate(date) {
    const data  = await fetchJson(`${BASE_URL}/${API_KEY}/eventsday.php?d=${date}&l=${LEAGUE_ID}`)    
    if(data.events === null) return []
    return data.events
}

export async function getFixturesForRange(startOffset, endOffset) {
    const today = new Date()
    const promises = []

    for (let i = startOffset; i <= endOffset; i++) {
        const date = addDays(today, i)
        promises.push(getFixturesByDate(formatDate(date)))
    }

    const results = await Promise.all(promises)
    return results.flat()
}

export function classifyFixtures(fixtures) {
    const now = new Date()
    const oneDayMs = 24 * 60 * 60 * 1000

    const live = []
    const recentResults = []
    const upcoming = []

    for (const fixture of fixtures) {
        const matchDate = new Date(fixture.strTimestamp + 'Z')
        const isFinished = fixture.strStatus === 'FT'
        const isNotStarted = fixture.strStatus === 'NS'

        if (!isFinished && !isNotStarted) {
            live.push(fixture)
        } else if (isFinished && matchDate <= now && (now - matchDate) <= oneDayMs) {
            recentResults.push(fixture)
        } else if (isNotStarted && matchDate > now) {
            upcoming.push(fixture)
        }
    }

    return { live, recentResults, upcoming }
}

export async function getFixtureById (id) {
    const data = await fetchJson(`${BASE_URL}/${API_KEY}/lookupevent.php?id=${id}`)        
    if(data.events === null) return null
    return data.events[0]
}

export async function getVenueById (id) {
    const data = await fetchJson(`${BASE_URL}/${API_KEY}/lookupvenue.php?id=${id}`)        
    if(data.venues === null) return null
    return data.venues[0]
}

export async function getPlayersByTeamId  (id) {
    const data = await fetchJson(`${BASE_URL}/${API_KEY}/lookup_all_players.php?id=${id}`)    
    if(data.player === null) return []
    return data.player
}

export async function getStandings() {
    const data = await fetchJson(`${BASE_URL}/${API_KEY}/lookuptable.php?l=${LEAGUE_ID}&s=${SEASON}`)
    return data.table || []
}