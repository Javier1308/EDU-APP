import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  return (
    <header className="h-14 bg-white border-b border-slate-100 flex items-center justify-between px-6">
      <div />
      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-500">{user?.email}</span>
        <button
          onClick={handleSignOut}
          className="text-sm text-slate-600 hover:text-red-500 transition-colors"
        >
          Salir
        </button>
      </div>
    </header>
  )
}
