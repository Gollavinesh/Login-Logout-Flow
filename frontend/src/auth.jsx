import React, { createContext, useContext, useEffect, useState } from 'react'

const AuthCtx = createContext(null)

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(API + '/api/auth/me', { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        setUser(data.user)
      })
      .finally(() => setLoading(false))
  }, [])

  async function login(email, password) {
    const res = await fetch(API + '/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.error || 'Login failed')
    }
    const data = await res.json()
    setUser(data)
  }

  async function register(email, password) {
    const res = await fetch(API + '/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.error || 'Register failed')
    }
    const data = await res.json()
    setUser(data)
  }

  async function logout() {
    await fetch(API + '/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    })
    setUser(null)
  }

  return (
    <AuthCtx.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthCtx.Provider>
  )
}

export function useAuth() {
  return useContext(AuthCtx)
}
