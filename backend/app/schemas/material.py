from pydantic import BaseModel, field_validator
from typing import Any
from app.models.material import MaterialType, EducationLevel, Grade


class CreateMaterialRequest(BaseModel):
    material_type: MaterialType
    education_level: EducationLevel
    grade: list[Grade]
    subject: str
    topic: str
    competence: str | None = None
    capacities: list[str] | None = None
    performances: list[str] | None = None
    additional_info: str | None = None

    @field_validator("grade")
    @classmethod
    def grade_not_empty(cls, v: list) -> list:
        if not v:
            raise ValueError("Debe seleccionar al menos un grado")
        return v


class SourceValidationResponse(BaseModel):
    source_name: str
    source_status: str
    relation_level: str
    validity_reason: str
    usage_recommendation: str


class CreateMaterialResponse(BaseModel):
    material_id: str
    material_type: str
    content: dict[str, Any]
    source_validation: SourceValidationResponse
    created_at: str
