import { Link, useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { getFixtureById, getVenueById, getPlayersByTeamId, getStandings } from "../api/sportsdb"
import { formatMatchTime, formatMatchDate, calculateAge } from "../utils/date"
import { translatePosition } from "../utils/translations"
import MatchDetailSkeleton from "../components/MatchDetailSkeleton"
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"

function MatchDetail() {
    const { id } = useParams()
    const [fixture, setFixture] = useState(null)
    const [venue, setVenue] = useState(null)
    const [homePlayers, setHomePlayers] = useState([])
    const [awayPlayers, setAwayPlayers] = useState([])
    const [teamStats, setTeamStats] = useState(null)
    const [error, setError] = useState(null)
    const [preview, setPreview] = useState(null)
    const [previewLoading, setPreviewLoading] = useState(false)
    const [previewError, setPreviewError] = useState(null)

    useEffect(() => {
        async function cargar() {
            try {
                const match = await getFixtureById(id)
                setFixture(match)
            } catch (err) {
                setError('No se pudo cargar el partido.')
            }
        }
        cargar()
    }, [id])

    useEffect(() => {
        if (!fixture) return
        async function cargarVenue() {
            try {
                const v = await getVenueById(fixture.idVenue)
                setVenue(v)
            } catch (err) {
                setError('No se pudo cargar el estadio.')
            }
        }
        cargarVenue()
    }, [fixture])

    useEffect(() => {
        if (!fixture) return
        async function cargarJugadores() {
            try {
                const [home, away] = await Promise.all([
                    getPlayersByTeamId(fixture.idHomeTeam),
                    getPlayersByTeamId(fixture.idAwayTeam)
                ])
                setHomePlayers(home)
                setAwayPlayers(away)
            } catch (err) {
                setError('No se pudieron cargar las plantillas.')
            }
        }
        cargarJugadores()
    }, [fixture])

    useEffect(() => {
    if (!fixture) return
        async function cargarStats() {
            try {
                const standings = await getStandings()
                const home = standings.find(team => team.idTeam === fixture.idHomeTeam)
                const away = standings.find(team => team.idTeam === fixture.idAwayTeam)
                setTeamStats({ home, away })
            } catch (err) {
                setError('No se pudieron cargar las estadísticas.')
            }
        }
        cargarStats()
    }, [fixture])

    async function generarPreview() {
        setPreviewLoading(true)
        setPreviewError(null)
        try {
            const response = await fetch('/api/preview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    homeTeam: fixture.strHomeTeam,
                    awayTeam: fixture.strAwayTeam,
                    round: fixture.intRound,
                    venue: venue?.strVenue,
                    homeStats: teamStats?.home,
                    awayStats: teamStats?.away
                })
            })
            if (!response.ok) throw new Error('Error del servidor')
            const data = await response.json()
            setPreview(data.preview)
        } catch (err) {
            setPreviewError('No se pudo generar la previa. Intenta de nuevo.')
        } finally {
            setPreviewLoading(false)
        }
    }

    if (error) return <p className="error-message">{error}</p>
    if (!fixture) return <MatchDetailSkeleton />

    const notStarted = fixture.strStatus === 'NS'
    const finished = fixture.strStatus === 'FT'

    const chartData = teamStats?.home && teamStats?.away ? [
        { stat: 'Goles a favor', [fixture.strHomeTeam]: Number(teamStats.home.intGoalsFor), [fixture.strAwayTeam]: Number(teamStats.away.intGoalsFor) },
        { stat: 'Goles en contra', [fixture.strHomeTeam]: Number(teamStats.home.intGoalsAgainst), [fixture.strAwayTeam]: Number(teamStats.away.intGoalsAgainst) },
        { stat: 'Puntos', [fixture.strHomeTeam]: Number(teamStats.home.intPoints), [fixture.strAwayTeam]: Number(teamStats.away.intPoints) },
        { stat: 'Victorias', [fixture.strHomeTeam]: Number(teamStats.home.intWin), [fixture.strAwayTeam]: Number(teamStats.away.intWin) },
    ] : []

    return (
        <div className="match-detail">
            <Link to="/" className="back-link">← Volver</Link>

            <div className="match-detail-banner">
                <span className="match-detail-chip">
                    {fixture.strLeague} · Jornada {fixture.intRound}
                </span>

                <div className="match-detail-teams">
                    <div className="match-detail-team">
                        <img src={fixture.strHomeTeamBadge} alt={fixture.strHomeTeam} />
                        <span>{fixture.strHomeTeam}</span>
                    </div>

                    <div className="match-detail-center">
                        {notStarted ? (
                            <>
                                <span className="match-detail-date">{formatMatchDate(fixture.strTimestamp)}</span>
                                <span className="match-detail-time">{formatMatchTime(fixture.strTimestamp)}</span>
                            </>
                        ) : (
                            <>
                                <span className="match-detail-score">
                                    {fixture.intHomeScore} - {fixture.intAwayScore}
                                </span>
                                {finished ? (
                                    <span className="finished-badge">Finalizado</span>
                                ) : (
                                    <span className="live-badge">EN VIVO</span>
                                )}
                            </>
                        )}
                    </div>

                    <div className="match-detail-team">
                        <img src={fixture.strAwayTeamBadge} alt={fixture.strAwayTeam} />
                        <span>{fixture.strAwayTeam}</span>
                    </div>
                </div>
            </div>

            <div className="match-detail-extra">
                <div className="venue-box">
                    {venue && (
                        <>
                            <p className="box-title">📍 {venue.strVenue}</p>
                            {venue.strLocation && <p className="box-subtitle">{venue.strLocation}</p>}
                            {venue.intCapacity && (
                                <p className="box-subtitle">
                                    {Number(venue.intCapacity).toLocaleString('es-CO')} espectadores
                                </p>
                            )}
                        </>
                    )}
                </div>

                <div className="video-box">
                    <p className="box-header">
                        <span className="yt-icon">▶</span> Resumen
                    </p>
                    {fixture.strVideo ? (
                        <a href={fixture.strVideo} target="_blank" rel="noreferrer" className="video-link">
                            Ver resumen en YouTube ↗
                        </a>
                    ) : (
                        <p className="box-empty">No disponible</p>
                    )}
                </div>
            </div>

            <div className="ai-preview">
                <p className="box-header">🤖 Previa generada por IA</p>

                {!preview && (
                    <button onClick={generarPreview} disabled={previewLoading} className="ai-button">
                        {previewLoading ? 'Generando...' : 'Generar previa'}
                    </button>
                )}

                {previewError && <p className="error-message">{previewError}</p>}

                {preview && <p className="ai-preview-text">{preview}</p>}
            </div>

            {chartData.length > 0 && (
                <div className="stats-chart">
                    <p className="box-header">Comparativa de temporada</p>
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={chartData}>
                            <XAxis dataKey="stat" stroke="var(--text-secondary)" fontSize={12} />
                            <YAxis stroke="var(--text-secondary)" fontSize={12} />
                            <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }} />
                            <Legend />
                            <Bar dataKey={fixture.strHomeTeam} fill="var(--accent)" radius={[4, 4, 0, 0]} />
                            <Bar dataKey={fixture.strAwayTeam} fill="var(--live)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}            

            <p className="roster-disclaimer">⚠️ Los datos de plantilla pueden no estar actualizados.</p>

            <div className="match-detail-rosters">
                <div className="roster-box">
                    <p className="box-header">{fixture.strHomeTeam}</p>
                    <ul className="roster-list">
                        {homePlayers.map(player => (
                            <li key={player.idPlayer}>
                                <span className="roster-number">{player.strNumber || '-'}</span>
                                <span className="roster-name">{player.strPlayer}</span>
                                <span className="roster-info">
                                    {translatePosition(player.strPosition)} · {calculateAge(player.dateBorn)} años · {player.strNationality}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="roster-box">
                    <p className="box-header">{fixture.strAwayTeam}</p>
                    <ul className="roster-list">
                        {awayPlayers.map(player => (
                            <li key={player.idPlayer}>
                                <span className="roster-number">{player.strNumber || '-'}</span>
                                <span className="roster-name">{player.strPlayer}</span>
                                <span className="roster-info">
                                    {translatePosition(player.strPosition)} · {calculateAge(player.dateBorn)} años · {player.strNationality}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default MatchDetail
