import { useLocation, useNavigate } from 'react-router-dom'
import type { CreateMaterialResponse, EvaluationResponse } from '../types'
import MaterialResult from '../components/results/MaterialResult'
import EvaluationResult from '../components/results/EvaluationResult'

export default function Result() {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as
    | { type: 'material'; result: CreateMaterialResponse }
    | { type: 'evaluation'; result: EvaluationResponse }
    | null

  if (!state) {
    navigate('/dashboard')
    return null
  }

  return (
    <div className="p-8 max-w-2xl">
      <button onClick={() => navigate(-1)}
        className="text-sm text-slate-500 hover:text-slate-800 mb-6 flex items-center gap-1">
        ← Volver
      </button>
      {state.type === 'material' ? (
        <MaterialResult result={state.result} />
      ) : (
        <EvaluationResult result={state.result} />
      )}
    </div>
  )
}
