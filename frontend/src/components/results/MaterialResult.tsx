import type { CreateMaterialResponse } from '../../types'
import SourceValidationCard from '../shared/SourceValidationCard'
import { useNavigate } from 'react-router-dom'

interface Props {
  result: CreateMaterialResponse
}

export default function MaterialResult({ result }: Props) {
  const navigate = useNavigate()
  const content = result.content

  function handleCopy() {
    const text = Object.entries(content)
      .map(([k, v]) => `${k.toUpperCase()}\n${Array.isArray(v) ? (v as string[]).join('\n') : v}`)
      .join('\n\n')
    navigator.clipboard.writeText(text)
  }

  function handleSendToEvaluate() {
    const text = Object.entries(content)
      .map(([k, v]) => `${k.toUpperCase()}\n${Array.isArray(v) ? (v as string[]).join('\n') : v}`)
      .join('\n\n')
    navigate('/evaluar', { state: { prefillText: text, material_id: result.material_id } })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800">Material generado</h2>
        <div className="flex gap-2">
          <button onClick={handleCopy}
            className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            Copiar
          </button>
          <button onClick={handleSendToEvaluate}
            className="px-3 py-1.5 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
            Enviar a evaluación
          </button>
        </div>
      </div>

      <SourceValidationCard validation={result.source_validation} />

      <div className="border border-slate-200 rounded-xl divide-y divide-slate-100">
        {Object.entries(content).map(([key, value]) => (
          <div key={key} className="px-5 py-4">
            <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
              {key.replace(/_/g, ' ')}
            </dt>
            <dd className="text-sm text-slate-700 whitespace-pre-wrap">
              {Array.isArray(value) ? (value as string[]).join('\n') : String(value)}
            </dd>
          </div>
        ))}
      </div>
    </div>
  )
}
