from app.database import supabase
from app.schemas.material import (
    CreateMaterialRequest,
    CreateMaterialResponse,
    SourceValidationResponse,
)
from app.agents import agent_router


RELATION_KEYWORDS = {
    "sesion_aprendizaje": ["sesión", "actividad", "aprendizaje", "aula"],
    "planificacion_anual": ["planificación", "anual", "programación"],
    "unidad_aprendizaje": ["unidad", "secuencia", "proyecto"],
    "ficha_trabajo": ["ficha", "ejercicio", "práctica"],
    "ficha_laboratorio": ["laboratorio", "experimento", "ciencias"],
    "recursos_educativos": ["recurso", "material", "apoyo"],
    "matriz_competencias": ["matriz", "competencia", "transversal"],
}


def _score_source(source: dict, request: CreateMaterialRequest) -> int:
    score = 0
    content = (source.get("content") or "").lower()
    keywords = RELATION_KEYWORDS.get(request.material_type.value, [])
    for kw in keywords:
        if kw in content:
            score += 1
    if request.subject.lower() in content:
        score += 2
    if request.topic.lower() in content:
        score += 3
    return score


def _relation_level(score: int) -> str:
    if score >= 4:
        return "alta"
    if score >= 2:
        return "media"
    return "baja"


async def create_material(request: CreateMaterialRequest, user_id: str) -> CreateMaterialResponse:
    sources_data = (
        supabase.table("sources")
        .select("*")
        .eq("is_active", True)
        .execute()
        .data or []
    )

    scored = sorted(sources_data, key=lambda s: _score_source(s, request), reverse=True)
    best_source = scored[0] if scored else None

    if best_source:
        score = _score_source(best_source, request)
        relation = _relation_level(score)
        source_validation = SourceValidationResponse(
            source_name=best_source["name"],
            source_status="activa",
            relation_level=relation,
            validity_reason=f"Fuente contiene contenido relevante para {request.material_type.value}",
            usage_recommendation="Usar como referencia principal para alinear el material al CNEB",
        )
        source_content = best_source.get("content") or ""
        source_id = best_source["id"]
    else:
        source_validation = SourceValidationResponse(
            source_name="Sin fuente",
            source_status="no_disponible",
            relation_level="baja",
            validity_reason="No se encontraron fuentes activas",
            usage_recommendation="Cargar fuentes pedagógicas base antes de generar materiales",
        )
        source_content = ""
        source_id = None

    request_data = {
        "material_type": request.material_type.value,
        "education_level": request.education_level.value,
        "grade": [g.value for g in request.grade],
        "subject": request.subject,
        "topic": request.topic,
        "competence": request.competence,
        "capacities": request.capacities,
        "performances": request.performances,
        "additional_info": request.additional_info,
    }

    content = await agent_router.generate_material(request_data, source_content)

    insert_data = {
        "user_id": user_id,
        "material_type": request.material_type.value,
        "education_level": request.education_level.value,
        "grade": [g.value for g in request.grade],
        "subject": request.subject,
        "topic": request.topic,
        "competence": request.competence,
        "capacities": request.capacities,
        "performances": request.performances,
        "additional_info": request.additional_info,
        "content": content,
        "status": "draft",
    }
    result = supabase.table("materials").insert(insert_data).execute()
    material_row = result.data[0]

    if source_id:
        supabase.table("source_validations").insert({
            "material_id": material_row["id"],
            "source_id": source_id,
            "relation_level": source_validation.relation_level,
            "validity_reason": source_validation.validity_reason,
            "usage_recommendation": source_validation.usage_recommendation,
        }).execute()

    return CreateMaterialResponse(
        material_id=material_row["id"],
        material_type=request.material_type.value,
        content=content,
        source_validation=source_validation,
        created_at=material_row["created_at"],
    )
