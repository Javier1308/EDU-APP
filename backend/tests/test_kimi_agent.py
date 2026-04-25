import pytest
from unittest.mock import AsyncMock, patch
from app.agents.kimi_agent import KimiAgent


@pytest.mark.asyncio
async def test_generate_material_returns_dict():
    agent = KimiAgent()
    mock_response = {
        "titulo": "Sesión: Fracciones",
        "competencia": "Resuelve problemas de cantidad",
        "proposito": "Comprender fracciones simples",
        "inicio": "Actividad motivadora con pizzas",
        "desarrollo": "Representación con materiales concretos",
        "cierre": "Reflexión metacognitiva",
        "recursos": ["pizarra", "material concreto"],
        "instrumento_evaluacion": "Lista de cotejo",
        "fuente_usada": "CNEB Primaria",
        "justificacion_pedagogica": "Alineado con competencia matemática"
    }

    with patch.object(agent, "_call_api", new_callable=AsyncMock, return_value=mock_response):
        result = await agent.generate_material(
            request_data={"topic": "Fracciones", "material_type": "sesion_aprendizaje"},
            source_content="Contenido CNEB..."
        )
    assert isinstance(result, dict)
    assert "titulo" in result


@pytest.mark.asyncio
async def test_evaluate_material_returns_dict():
    agent = KimiAgent()
    mock_response = {
        "puntaje_general": 85,
        "nivel": "Bueno",
        "criterios": [],
        "fortalezas": [],
        "oportunidades_de_mejora": [],
        "recomendacion_final": "Usar con ajustes",
        "version_mejorada_sugerida": "..."
    }

    with patch.object(agent, "_call_api", new_callable=AsyncMock, return_value=mock_response):
        result = await agent.evaluate_material(
            material_text="Texto del material...",
            sources_context="CNEB...",
            criteria=["Alineación curricular"]
        )
    assert result["puntaje_general"] == 85
