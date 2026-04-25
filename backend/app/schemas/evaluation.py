from pydantic import BaseModel, model_validator
from app.models.material import MaterialType, EducationLevel, Grade


class CriterionResult(BaseModel):
    criterio: str
    puntaje: int
    comentario: str


class EvaluateMaterialRequest(BaseModel):
    input_text: str | None = None
    file_url: str | None = None
    material_type: MaterialType
    education_level: EducationLevel
    grade: Grade
    subject: str
    material_id: str | None = None

    @model_validator(mode="after")
    def text_or_file_required(self) -> "EvaluateMaterialRequest":
        if not self.input_text and not self.file_url:
            raise ValueError("Debe enviar input_text o file_url")
        return self


class EvaluateMaterialResponse(BaseModel):
    evaluation_id: str
    puntaje_general: int
    nivel: str
    criterios: list[CriterionResult]
    fortalezas: list[str]
    oportunidades_de_mejora: list[str]
    recomendacion_final: str
    version_mejorada_sugerida: str
