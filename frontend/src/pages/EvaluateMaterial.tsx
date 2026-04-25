import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { api } from '../lib/api'
import type { EvaluationResponse } from '../types'
import EvaluateMaterialForm from '../components/forms/EvaluateMaterialForm'
import type { EvaluateFormData } from '../components/forms/EvaluateMaterialForm'
import LoadingState from '../components/shared/LoadingState'

export default function EvaluateMaterial() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(data: EvaluateFormData) {
    if (!token) return
    setLoading(true)
    setError('')
    try {
      const payload = {
        ...data,
        material_id: location.state?.material_id ?? undefined,
      }
      const result = await api.evaluateMaterial(payload, token) as EvaluationResponse
      navigate('/resultado', { state: { type: 'evaluation', result } })
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-xl font-bold text-slate-800 mb-1">Evaluar material pedagógico</h1>
      <p className="text-slate-500 text-sm mb-6">Pega tu material y recibe un diagnóstico alineado al CNEB.</p>
      {loading ? (
        <LoadingState message="Analizando y evaluando con rúbrica pedagógica..." />
      ) : (
        <>
          {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>}
          <EvaluateMaterialForm
            onSubmit={handleSubmit}
            loading={loading}
            initialText={location.state?.prefillText}
          />
        </>
      )}
    </div>
  )
}
