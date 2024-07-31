import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Pages
import Home from './pages/Home/Home'
import About from './pages/About/About'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'

// Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'

function App() {


  return (
    <>
      <div>
        <BrowserRouter>
        <div className="container">
          <Navbar/>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Routes>
        </div>
        <Footer/>
        </BrowserRouter>
      </div>

    </>
  )
}

export default App
