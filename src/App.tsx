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
import CreatePost from './pages/CreatePost/CreatePost'
import Dashboard from './pages/Dashboard/Dashboard'
import Search from './pages/Search/Search'
import Post from './pages/Post/Post'
import EditPost from './pages/EditPost/EditPost'

// Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'

function App() {

  const [user, setUser] = useState<any>(undefined)
  const {auth} = useAuthentication()

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
  <AuthProvider value={{user}}>
        <BrowserRouter>
          <div className="container">
            <Navbar/>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/about' element={<About />} />
            <Route path='/search' element={<Search />} />
            <Route path='/posts/:id' element={<Post />} />
            <Route path='/login' element={!user ? <Login /> : <Navigate to="/" />} />
            <Route path='/register' element={!user ? <Register /> : <Navigate to="/" />} />
            <Route path='/posts/edit:id' element={user ? <EditPost /> : <Navigate to="/" />} />
            <Route path='/posts/create' element={user ? <CreatePost /> : <Navigate to="/login" />}/>
            <Route path='/dashboard' element={user ? <Dashboard /> : <Navigate to="/login" />}/>
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
