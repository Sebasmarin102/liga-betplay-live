import { Link } from "react-router-dom";
import { formatMatchTime, formatMatchDate } from "../utils/date";

function MatchCard({ fixture }) {
    const finished = fixture.strStatus === 'FT'
    const notStarted = fixture.strStatus === 'NS'
    
    return (
        <Link to={`/partido/${fixture.idEvent}`} className="match-card">
            <div className="match-card-team">
                <img src={fixture.strHomeTeamBadge} alt={fixture.strHomeTeam} />
                <span>{fixture.strHomeTeam}</span>
            </div>

            <div className="match-card-center">
                {notStarted && (
                    <>
                    <span>{formatMatchTime(fixture.strTimestamp)}</span>
                    <span className="match-card-date">{formatMatchDate(fixture.strTimestamp)}</span>
                    </>
                )}
                {finished && (
                    <>
                    <span>{fixture.intHomeScore} - {fixture.intAwayScore}</span>
                    <span className="finished-badge">Finalizado</span>
                    </>
                )}
                {!notStarted && !finished && (
                    <>
                    <span>{fixture.intHomeScore} - {fixture.intAwayScore}</span>
                    <span className="live-badge">EN VIVO</span>
                    </>
                )}
            </div>

            <div className="match-card-team">
                <img src={fixture.strAwayTeamBadge} alt={fixture.strAwayTeam} />
                <span>{fixture.strAwayTeam}</span>
            </div>
        </Link>
    )
}

export default MatchCard