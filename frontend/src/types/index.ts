export type MaterialType =
  | 'planificacion_anual'
  | 'unidad_aprendizaje'
  | 'sesion_aprendizaje'
  | 'recursos_educativos'
  | 'matriz_competencias'
  | 'ficha_trabajo'
  | 'ficha_laboratorio'

export type Grade = '1ro' | '2do' | '3ro' | '4to' | '5to' | '6to'

export interface SourceValidation {
  source_name: string
  source_status: string
  relation_level: string
  validity_reason: string
  usage_recommendation: string
}

export interface CreateMaterialResponse {
  material_id: string
  material_type: MaterialType
  content: Record<string, unknown>
  source_validation: SourceValidation
  created_at: string
}

export interface CriterionResult {
  criterio: string
  puntaje: number
  comentario: string
}

export interface EvaluationResponse {
  evaluation_id: string
  puntaje_general: number
  nivel: string
  criterios: CriterionResult[]
  fortalezas: string[]
  oportunidades_de_mejora: string[]
  recomendacion_final: string
  version_mejorada_sugerida: string
}
