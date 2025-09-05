import { useAuth } from '../auth'

export default function Dashboard() {
  const { user } = useAuth()
  return (
    <div>
      <h2>Dashboard</h2>
      <p>You are logged in as <strong>{user?.email}</strong>.</p>
      <p>This /dashboard route is protected.</p>
    </div>
  )
}
