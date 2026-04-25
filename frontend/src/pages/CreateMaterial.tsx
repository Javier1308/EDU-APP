import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { api } from '../lib/api'
import type { CreateMaterialResponse } from '../types'
import CreateMaterialForm from '../components/forms/CreateMaterialForm'
import type { CreateMaterialFormData } from '../components/forms/CreateMaterialForm'
import LoadingState from '../components/shared/LoadingState'

export default function CreateMaterial() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(data: CreateMaterialFormData) {
    if (!token) return
    setLoading(true)
    setError('')
    try {
      const payload = {
        ...data,
        capacities: data.capacities ? data.capacities.split('\n').filter(Boolean) : undefined,
        performances: data.performances ? data.performances.split('\n').filter(Boolean) : undefined,
      }
      const result = await api.createMaterial(payload, token) as CreateMaterialResponse
      navigate('/resultado', { state: { type: 'material', result } })
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-xl font-bold text-slate-800 mb-1">Crear material pedagógico</h1>
      <p className="text-slate-500 text-sm mb-6">Completa los datos y la IA generará el material alineado al CNEB.</p>
      {loading ? (
        <LoadingState message="Investigando fuentes y generando material..." />
      ) : (
        <>
          {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>}
          <CreateMaterialForm onSubmit={handleSubmit} loading={loading} />
        </>
      )}
    </div>
  )
}
