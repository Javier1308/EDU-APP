import { NavLink } from 'react-router-dom'

const links = [
  { to: '/dashboard', label: 'Inicio', icon: '⊞' },
  { to: '/crear', label: 'Crear material', icon: '✦' },
  { to: '/evaluar', label: 'Evaluar material', icon: '◎' },
]

export default function Sidebar() {
  return (
    <aside className="w-56 min-h-screen bg-slate-900 text-slate-100 flex flex-col py-6 px-4">
      <div className="mb-8 px-2">
        <span className="text-lg font-bold text-white">EduIA</span>
        <p className="text-xs text-slate-400 mt-0.5">Para docentes</p>
      </div>
      <nav className="space-y-1">
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`
            }
          >
            <span>{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
