import { useState } from 'react'
import type { FormEvent } from 'react'
import type { MaterialType, Grade } from '../../types'

const MATERIAL_TYPES: { value: MaterialType; label: string }[] = [
  { value: 'planificacion_anual', label: 'Planificación anual' },
  { value: 'unidad_aprendizaje', label: 'Unidad de aprendizaje' },
  { value: 'sesion_aprendizaje', label: 'Sesión de aprendizaje' },
  { value: 'recursos_educativos', label: 'Recursos educativos' },
  { value: 'matriz_competencias', label: 'Matriz de competencias' },
  { value: 'ficha_trabajo', label: 'Ficha de trabajo' },
  { value: 'ficha_laboratorio', label: 'Ficha de laboratorio' },
]

const GRADES: { value: Grade; label: string }[] = [
  { value: '1ro', label: '1er grado' }, { value: '2do', label: '2do grado' },
  { value: '3ro', label: '3er grado' }, { value: '4to', label: '4to grado' },
  { value: '5to', label: '5to grado' }, { value: '6to', label: '6to grado' },
]

const SUBJECTS = ['Matemática', 'Ciencias y Tecnología', 'Comunicación', 'Personal Social',
  'Arte y Cultura', 'Educación Física', 'Educación Religiosa']

export interface EvaluateFormData {
  input_text?: string
  material_type: MaterialType
  education_level: 'primaria'
  grade: Grade
  subject: string
}

interface Props {
  onSubmit: (data: EvaluateFormData) => void
  loading: boolean
  initialText?: string
}

export default function EvaluateMaterialForm({ onSubmit, loading, initialText }: Props) {
  const [form, setForm] = useState<EvaluateFormData>({
    material_type: 'sesion_aprendizaje',
    education_level: 'primaria',
    grade: '3ro',
    subject: 'Matemática',
    input_text: initialText ?? '',
  })

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de material</label>
        <select value={form.material_type}
          onChange={e => setForm(f => ({ ...f, material_type: e.target.value as MaterialType }))}
          className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
          {MATERIAL_TYPES.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Grado</label>
          <select value={form.grade}
            onChange={e => setForm(f => ({ ...f, grade: e.target.value as Grade }))}
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
            {GRADES.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Área curricular</label>
          <select value={form.subject}
            onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
            {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Material a evaluar</label>
        <textarea required value={form.input_text}
          onChange={e => setForm(f => ({ ...f, input_text: e.target.value }))}
          rows={10} placeholder="Pega aquí el texto de tu material pedagógico..."
          className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none font-mono" />
      </div>

      <button type="submit" disabled={loading || !form.input_text?.trim()}
        className="w-full bg-emerald-600 text-white rounded-lg py-3 text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors">
        {loading ? 'Evaluando...' : 'Evaluar material'}
      </button>
    </form>
  )
}
