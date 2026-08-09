import { Link } from "react-router-dom"

function Header() {
    return (
        <header className="site-header">
            <img
                src="https://r2.thesportsdb.com/images/media/league/badge/sdz1351580833297.png"
                alt="Categoría Primera A"
                className="site-header-badge"
            />
            <div>
                <h1>Liga BetPlay</h1>
                <p>Categoría Primera A · Colombia</p>
            </div>
            <nav className="site-nav">
                <Link to="/">Partidos</Link>
                <Link to="/posiciones">Posiciones</Link>
            </nav>
        </header>
    )
}

export default Header
