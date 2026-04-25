import pytest
from unittest.mock import AsyncMock, patch, MagicMock


@pytest.mark.asyncio
async def test_create_material_returns_response():
    with patch("app.services.material_service.supabase") as mock_db, \
         patch("app.agents.agent_router.generate_material", new_callable=AsyncMock) as mock_agent:

        mock_sources = MagicMock()
        mock_sources.execute.return_value.data = [
            {"id": "src-1", "name": "CNEB Primaria", "content": "Contenido CNEB...", "is_active": True}
        ]
        mock_db.table.return_value.select.return_value.eq.return_value = mock_sources

        mock_insert = MagicMock()
        mock_insert.execute.return_value.data = [
            {"id": "mat-1", "created_at": "2026-04-25T00:00:00"}
        ]
        mock_db.table.return_value.insert.return_value = mock_insert

        mock_agent.return_value = {
            "titulo": "Sesión de fracciones",
            "competencia": "Resuelve problemas de cantidad",
        }

        from app.services.material_service import create_material
        from app.schemas.material import CreateMaterialRequest
        from app.models.material import MaterialType, EducationLevel, Grade

        request = CreateMaterialRequest(
            material_type=MaterialType.SESION_APRENDIZAJE,
            education_level=EducationLevel.PRIMARIA,
            grade=[Grade.TERCERO],
            subject="Matemática",
            topic="Fracciones",
        )
        result = await create_material(request, user_id="user-1")
        assert result.material_id == "mat-1"
        assert "titulo" in result.content
