import httpx
import json
from app.config import settings


GENERATE_SYSTEM_PROMPT = """Eres un especialista en educación peruana primaria.
Genera materiales pedagógicos estructurados y alineados al CNEB.
Responde SIEMPRE con un JSON válido y sin texto adicional."""

EVALUATE_SYSTEM_PROMPT = """Eres un evaluador experto en materiales pedagógicos peruanos.
Evalúa el material con la rúbrica proporcionada.
Responde SIEMPRE con un JSON válido y sin texto adicional."""


class KimiAgent:
    def __init__(self):
        self.api_url = settings.kimi_api_url
        self.model = settings.kimi_model
        self.headers = {
            "Authorization": f"Bearer {settings.kimi_api_key}",
            "Content-Type": "application/json",
        }

    async def _call_api(self, system_prompt: str, user_prompt: str) -> dict:
        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            "temperature": 0.3,
            "response_format": {"type": "json_object"},
        }
        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.post(
                f"{self.api_url}/chat/completions",
                headers=self.headers,
                json=payload,
            )
            response.raise_for_status()
            content = response.json()["choices"][0]["message"]["content"]
            return json.loads(content)

    async def generate_material(self, request_data: dict, source_content: str) -> dict:
        user_prompt = f"""Genera un material pedagógico con estos datos:
{json.dumps(request_data, ensure_ascii=False, indent=2)}

Usa esta fuente pedagógica como referencia:
{source_content[:3000]}

Devuelve un JSON con todos los campos del tipo de material solicitado."""
        return await self._call_api(GENERATE_SYSTEM_PROMPT, user_prompt)

    async def evaluate_material(
        self, material_text: str, sources_context: str, criteria: list[str]
    ) -> dict:
        criteria_str = "\n".join(f"- {c}" for c in criteria)
        user_prompt = f"""Evalúa este material pedagógico:

MATERIAL:
{material_text[:4000]}

FUENTES DE REFERENCIA:
{sources_context[:2000]}

RÚBRICA (puntaje 0-100 por criterio):
{criteria_str}

Devuelve un JSON con: puntaje_general, nivel, criterios (lista con criterio/puntaje/comentario),
fortalezas, oportunidades_de_mejora, recomendacion_final, version_mejorada_sugerida."""
        return await self._call_api(EVALUATE_SYSTEM_PROMPT, user_prompt)
