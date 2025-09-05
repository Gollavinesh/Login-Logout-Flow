import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../auth'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { register } = useAuth()

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      await register(email, password)
      navigate('/dashboard')
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: 360 }}>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <label>Email</label><br/>
        <input value={email} onChange={e => setEmail(e.target.value)} type="email" required />
      </div>
      <div>
        <label>Password</label><br/>
        <input value={password} onChange={e => setPassword(e.target.value)} type="password" required />
      </div>
      <button type="submit">Create Account</button>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </form>
  )
}
