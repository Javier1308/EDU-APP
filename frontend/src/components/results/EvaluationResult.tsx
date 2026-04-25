import type { EvaluationResponse } from '../../types'

const levelColor: Record<string, string> = {
  Excelente: 'text-emerald-600 bg-emerald-50',
  Bueno: 'text-blue-600 bg-blue-50',
  Regular: 'text-yellow-600 bg-yellow-50',
  'Por mejorar': 'text-red-600 bg-red-50',
}

interface Props { result: EvaluationResponse }

export default function EvaluationResult({ result }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 p-5 border border-slate-200 rounded-xl bg-slate-50">
        <div className="text-center">
          <div className="text-4xl font-bold text-slate-800">{result.puntaje_general}</div>
          <div className="text-xs text-slate-500">/ 100</div>
        </div>
        <div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${levelColor[result.nivel] ?? 'bg-slate-100 text-slate-600'}`}>
            {result.nivel}
          </span>
          <p className="text-sm text-slate-600 mt-1">{result.recomendacion_final}</p>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Criterios evaluados</h3>
        <div className="space-y-3">
          {result.criterios.map(({ criterio, puntaje, comentario }) => (
            <div key={criterio} className="border border-slate-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-slate-700">{criterio}</span>
                <span className="text-sm font-bold text-slate-800">{puntaje}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 mb-1.5">
                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${puntaje}%` }} />
              </div>
              <p className="text-xs text-slate-500">{comentario}</p>
            </div>
          ))}
        </div>
      </div>

      {result.fortalezas.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-emerald-700 mb-2">Fortalezas</h3>
          <ul className="space-y-1">
            {result.fortalezas.map((f, i) => (
              <li key={i} className="text-sm text-slate-600 flex gap-2"><span className="text-emerald-500">✓</span>{f}</li>
            ))}
          </ul>
        </div>
      )}

      {result.oportunidades_de_mejora.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-amber-700 mb-2">Oportunidades de mejora</h3>
          <ul className="space-y-1">
            {result.oportunidades_de_mejora.map((o, i) => (
              <li key={i} className="text-sm text-slate-600 flex gap-2"><span className="text-amber-500">→</span>{o}</li>
            ))}
          </ul>
        </div>
      )}

      {result.version_mejorada_sugerida && (
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-2">Versión mejorada sugerida</h3>
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 text-sm text-slate-700 whitespace-pre-wrap">
            {result.version_mejorada_sugerida}
          </div>
        </div>
      )}
    </div>
  )
}
