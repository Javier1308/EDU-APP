import type { SourceValidation } from '../../types'

const levelColor: Record<string, string> = {
  alta: 'bg-emerald-100 text-emerald-700',
  media: 'bg-yellow-100 text-yellow-700',
  baja: 'bg-red-100 text-red-700',
}

export default function SourceValidationCard({ validation }: { validation: SourceValidation }) {
  return (
    <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 text-sm space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-medium text-slate-700">Fuente usada</span>
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${levelColor[validation.relation_level] ?? 'bg-slate-100 text-slate-600'}`}>
          Relación {validation.relation_level}
        </span>
      </div>
      <p className="text-slate-800 font-medium">{validation.source_name}</p>
      <p className="text-slate-500">{validation.validity_reason}</p>
      <p className="text-slate-500 italic">{validation.usage_recommendation}</p>
    </div>
  )
}
