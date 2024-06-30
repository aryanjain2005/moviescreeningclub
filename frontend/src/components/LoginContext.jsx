import React, { createContext, useContext, useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'

const LoginContext = createContext()

export const useLogin = () => useContext(LoginContext)

export const LoginProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  useEffect(() => {
    const token = localStorage.getItem('token')
    try {
      if (token) {
        const decodedToken = jwtDecode(token)
        const currentTime = Date.now() / 1000
        if (decodedToken.exp + 2 * 60 < currentTime) {
          localStorage.removeItem('token')
          setLoggedIn(false)
        } else {
          setLoggedIn(true)
          setUser(decodedToken)
        }
      } else {
        setLoggedIn(false)
      }
    } catch (e) {
      localStorage.removeItem('token')
      console.log(e)
    }
  }, [loggedIn])

  const login = (token) => {
    setLoggedIn(true)
    localStorage.setItem('token', token)
  }
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('loggedInUserEmail')
    localStorage.removeItem('signupEmail')
    localStorage.removeItem('userType')
    localStorage.removeItem('getotpEmail')
    setLoggedIn(false)
    setUser(null)
    navigate('/login')
  }
  if (loggedIn && !user) {
    return <div>Loading...</div>
  }

  return (
    <LoginContext.Provider value={{ loggedIn, login, logout, user }}>
      {children}
    </LoginContext.Provider>
  )
}
