import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import MatchDetail from './pages/MatchDetail'
import Header from './components/Header'
import Standings from './pages/Standings'
import ScrollToTop from './components/ScrollToTop'
import './App.css'

function App() {

  return (
    <>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/partido/:id' element={<MatchDetail/>}/>
        <Route path='/posiciones' element={<Standings/>}/>
      </Routes>
    </>
  )
}

export default App
