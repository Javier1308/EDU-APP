import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const options = [
  {
    to: '/crear',
    title: 'Crear material',
    description: 'Genera sesiones, unidades, fichas y más a partir de tu necesidad educativa.',
    icon: '✦',
    color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    to: '/evaluar',
    title: 'Evaluar material',
    description: 'Sube o pega un material y recibe un diagnóstico alineado al CNEB.',
    icon: '◎',
    color: 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100',
    iconColor: 'text-emerald-600',
  },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-slate-800 mb-1">Bienvenido</h1>
      <p className="text-slate-500 text-sm mb-8">{user?.email}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {options.map(({ to, title, description, icon, color, iconColor }) => (
          <button
            key={to}
            onClick={() => navigate(to)}
            className={`border rounded-2xl p-6 text-left transition-colors ${color}`}
          >
            <span className={`text-3xl mb-3 block ${iconColor}`}>{icon}</span>
            <h2 className="font-semibold text-slate-800 mb-1">{title}</h2>
            <p className="text-sm text-slate-500">{description}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
