import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'

// Hooks
import { useState, useEffect } from 'react'
import { useAuthentication } from './hooks/useAuthentication'

// Context
import { AuthProvider } from './context/AuthContext'

// Pages
import Home from './pages/Home/Home'
import About from './pages/About/About'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'

// Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'

function App() {

  const [user, setUser] = useState(undefined)
  const [auth] = useAuthentication()

  const loadingUser = user === undefined

  useEffect(() => {

    onAuthStateChanged(auth, (user) => {
      setUser(user)
    })

  }, [auth])

  if(loadingUser) {
    return <p>Carregando...</p>
  }



  return (
    <>
      <div>
  <AuthProvider>
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
    </AuthProvider>
      </div>

    </>
  )
}

export default App
