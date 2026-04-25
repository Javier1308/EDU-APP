import { useState } from 'react'
import type { FormEvent } from 'react'
import type { MaterialType, Grade } from '../../types'

const MATERIAL_TYPES: { value: MaterialType; label: string }[] = [
  { value: 'planificacion_anual', label: 'Planificación anual' },
  { value: 'unidad_aprendizaje', label: 'Unidad de aprendizaje' },
  { value: 'sesion_aprendizaje', label: 'Sesión de aprendizaje' },
  { value: 'recursos_educativos', label: 'Recursos educativos' },
  { value: 'matriz_competencias', label: 'Matriz de competencias transversales' },
  { value: 'ficha_trabajo', label: 'Ficha de trabajo' },
  { value: 'ficha_laboratorio', label: 'Ficha de laboratorio' },
]

const GRADES: { value: Grade; label: string }[] = [
  { value: '1ro', label: '1er grado' },
  { value: '2do', label: '2do grado' },
  { value: '3ro', label: '3er grado' },
  { value: '4to', label: '4to grado' },
  { value: '5to', label: '5to grado' },
  { value: '6to', label: '6to grado' },
]

const SUBJECTS = ['Matemática', 'Ciencias y Tecnología', 'Comunicación', 'Personal Social',
  'Arte y Cultura', 'Educación Física', 'Educación Religiosa']

export interface CreateMaterialFormData {
  material_type: MaterialType
  education_level: 'primaria'
  grade: Grade[]
  subject: string
  topic: string
  competence: string
  capacities: string
  performances: string
  additional_info: string
}

interface Props {
  onSubmit: (data: CreateMaterialFormData) => void
  loading: boolean
}

export default function CreateMaterialForm({ onSubmit, loading }: Props) {
  const [form, setForm] = useState<CreateMaterialFormData>({
    material_type: 'sesion_aprendizaje',
    education_level: 'primaria',
    grade: [],
    subject: 'Matemática',
    topic: '',
    competence: '',
    capacities: '',
    performances: '',
    additional_info: '',
  })

  function toggleGrade(g: Grade) {
    setForm(f => ({
      ...f,
      grade: f.grade.includes(g) ? f.grade.filter(x => x !== g) : [...f.grade, g],
    }))
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (form.grade.length === 0) return
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de material</label>
        <select value={form.material_type}
          onChange={e => setForm(f => ({ ...f, material_type: e.target.value as MaterialType }))}
          className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          {MATERIAL_TYPES.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Grado(s)</label>
        <div className="flex flex-wrap gap-2">
          {GRADES.map(({ value, label }) => (
            <button key={value} type="button" onClick={() => toggleGrade(value)}
              className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                form.grade.includes(value)
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
              }`}>
              {label}
            </button>
          ))}
        </div>
        {form.grade.length === 0 && <p className="text-xs text-red-500 mt-1">Selecciona al menos un grado</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Área curricular</label>
        <select value={form.subject}
          onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
          className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Tema</label>
        <input type="text" required value={form.topic}
          onChange={e => setForm(f => ({ ...f, topic: e.target.value }))}
          placeholder="Ej: Fracciones, Ecosistemas, La narración..."
          className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Competencia <span className="text-slate-400 font-normal">(opcional)</span></label>
        <textarea value={form.competence}
          onChange={e => setForm(f => ({ ...f, competence: e.target.value }))}
          rows={2} placeholder="Ej: Resuelve problemas de cantidad..."
          className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Capacidades <span className="text-slate-400 font-normal">(opcional)</span></label>
        <textarea value={form.capacities}
          onChange={e => setForm(f => ({ ...f, capacities: e.target.value }))}
          rows={2} placeholder="Una por línea..."
          className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Desempeños <span className="text-slate-400 font-normal">(opcional)</span></label>
        <textarea value={form.performances}
          onChange={e => setForm(f => ({ ...f, performances: e.target.value }))}
          rows={2} placeholder="Una por línea..."
          className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Información adicional <span className="text-slate-400 font-normal">(opcional)</span></label>
        <textarea value={form.additional_info}
          onChange={e => setForm(f => ({ ...f, additional_info: e.target.value }))}
          rows={3} placeholder="Contexto del aula, necesidades especiales, recursos disponibles..."
          className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
      </div>

      <button type="submit" disabled={loading || form.grade.length === 0}
        className="w-full bg-blue-600 text-white rounded-lg py-3 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
        {loading ? 'Generando material...' : 'Generar material pedagógico'}
      </button>
    </form>
  )
}
