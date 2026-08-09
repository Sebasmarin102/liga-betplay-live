import { useState, useEffect } from "react"
import { getStandings } from "../api/sportsdb"

function Standings() {
    const [standings, setStandings] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function cargar() {
            try {
                const data = await getStandings()
                setStandings(data)
            } catch (err) {
                setError('No se pudo cargar la tabla de posiciones.')
            } finally {
                setLoading(false)
            }
        }
        cargar()
    }, [])

    if (error) return <p className="error-message">{error}</p>

    return (
        <div className="standings">
            <h2>Tabla de Posiciones</h2>
            <p className="roster-disclaimer">⚠️ Los tabla de posiciones puede no estar actualizada.</p>
            <div className="standings-table-wrapper">
                <table className="standings-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Equipo</th>
                            <th>PJ</th>
                            <th>G</th>
                            <th>E</th>
                            <th>P</th>
                            <th>GF</th>
                            <th>GC</th>
                            <th>DG</th>
                            <th>Pts</th>
                            <th>Forma</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading
                            ? Array(10).fill(0).map((_, i) => (
                                <tr key={i}>
                                    <td colSpan={11}>
                                        <div className="skeleton skeleton-row"></div>
                                    </td>
                                </tr>
                              ))
                            : standings.map(team => (
                                <tr key={team.idTeam}>
                                    <td>{team.intRank}</td>
                                    <td className="standings-team">
                                        <img src={team.strBadge} alt={team.strTeam} />
                                        {team.strTeam}
                                    </td>
                                    <td>{team.intPlayed}</td>
                                    <td>{team.intWin}</td>
                                    <td>{team.intDraw}</td>
                                    <td>{team.intLoss}</td>
                                    <td>{team.intGoalsFor}</td>
                                    <td>{team.intGoalsAgainst}</td>
                                    <td>{team.intGoalDifference}</td>
                                    <td className="standings-points">{team.intPoints}</td>
                                    <td>
                                        <div className="form-dots">
                                            {team.strForm && team.strForm.split('').map((result, i) => (
                                                <span key={i} className={`form-dot form-${result}`}>{result}</span>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                              ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Standings
