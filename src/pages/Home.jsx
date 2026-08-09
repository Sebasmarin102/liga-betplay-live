import { useEffect, useState } from "react"
import { getFixturesForRange, classifyFixtures } from "../api/sportsdb"
import MatchCard from "../components/MatchCard"
import SkeletonCard from "../components/SkeletonCard"

function Home() {
    const [fixtures, setFixtures] = useState({ live: [], recentResults: [], upcoming: [] })
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function cargar() {
            try {
                const matches = await getFixturesForRange(-1, 7)
                const clasificados = classifyFixtures(matches)
                setFixtures(clasificados)
            } catch (err) {
                setError('No se pudieron cargar los partidos. Intenta de nuevo más tarde.')
            } finally {
                setLoading(false)
            }           
        }
        cargar()
    }, [])

    if (error) return <p className="error-message">{error}</p>

    return (
        <div className="home">
            <section>
                <h2>En vivo</h2>
                <div className="cards-grid">
                    {loading
                        ? Array(3).fill(0).map((_, i) => <SkeletonCard key={i} />)
                        : fixtures.live.map(fixture => (
                            <MatchCard key={fixture.idEvent} fixture={fixture}/>
                          ))
                    }
                </div>
            </section>

            <section>
                <h2>Partidos ya finalizados</h2>
                <div className="cards-grid">
                    {loading
                        ? Array(3).fill(0).map((_, i) => <SkeletonCard key={i} />)
                        : fixtures.recentResults.map(fixture => (
                            <MatchCard key={fixture.idEvent} fixture={fixture}/>
                          ))
                    }
                </div>
            </section>

            <section>
                <h2>Próximos partidos</h2>
                <div className="cards-grid">
                    {loading
                        ? Array(3).fill(0).map((_, i) => <SkeletonCard key={i} />)
                        : fixtures.upcoming.map(fixture => (
                            <MatchCard key={fixture.idEvent} fixture={fixture}/>
                          ))
                    }
                </div>
            </section>
        </div>
    )
}

export default Home

