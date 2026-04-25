from app.agents.kimi_agent import KimiAgent

_kimi = KimiAgent()


async def generate_material(request_data: dict, source_content: str) -> dict:
    return await _kimi.generate_material(request_data, source_content)


async def evaluate_material(
    material_text: str, sources_context: str, criteria: list[str]
) -> dict:
    return await _kimi.evaluate_material(material_text, sources_context, criteria)
