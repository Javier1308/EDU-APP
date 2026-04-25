from app.database import supabase
from app.schemas.evaluation import EvaluateMaterialRequest, EvaluateMaterialResponse, CriterionResult
from app.models.rubric import RUBRIC_CRITERIA, get_level
from app.agents import agent_router
from app.utils.file_parser import extract_text_from_url


async def evaluate_material(request: EvaluateMaterialRequest, user_id: str) -> EvaluateMaterialResponse:
    if request.input_text:
        material_text = request.input_text
    else:
        material_text = await extract_text_from_url(request.file_url)

    sources_data = (
        supabase.table("sources")
        .select("name, content")
        .eq("is_active", True)
        .execute()
        .data or []
    )
    sources_context = "\n\n".join(
        f"[{s['name']}]\n{(s.get('content') or '')[:500]}" for s in sources_data[:3]
    )

    raw = await agent_router.evaluate_material(material_text, sources_context, RUBRIC_CRITERIA)

    criterios = [
        CriterionResult(
            criterio=c.get("criterio", ""),
            puntaje=int(c.get("puntaje", 0)),
            comentario=c.get("comentario", ""),
        )
        for c in raw.get("criterios", [])
    ]

    puntaje_general = int(raw.get("puntaje_general", 0))
    nivel = raw.get("nivel") or get_level(puntaje_general)

    insert_data = {
        "user_id": user_id,
        "material_id": request.material_id,
        "input_text": material_text[:5000],
        "file_url": request.file_url,
        "material_type": request.material_type.value,
        "education_level": request.education_level.value,
        "grade": request.grade.value,
        "subject": request.subject,
        "result": raw,
    }
    result = supabase.table("evaluations").insert(insert_data).execute()
    evaluation_id = result.data[0]["id"]

    return EvaluateMaterialResponse(
        evaluation_id=evaluation_id,
        puntaje_general=puntaje_general,
        nivel=nivel,
        criterios=criterios,
        fortalezas=raw.get("fortalezas", []),
        oportunidades_de_mejora=raw.get("oportunidades_de_mejora", []),
        recomendacion_final=raw.get("recomendacion_final", ""),
        version_mejorada_sugerida=raw.get("version_mejorada_sugerida", ""),
    )
