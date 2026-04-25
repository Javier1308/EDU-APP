from fastapi import APIRouter, Depends, HTTPException
from app.dependencies import verify_token
from app.schemas.material import CreateMaterialRequest, CreateMaterialResponse
from app.schemas.evaluation import EvaluateMaterialRequest, EvaluateMaterialResponse
from app.services.material_service import create_material
from app.services.evaluation_service import evaluate_material

router = APIRouter()


@router.post("/create", response_model=CreateMaterialResponse)
async def create_material_endpoint(
    body: CreateMaterialRequest,
    current_user: dict = Depends(verify_token),
):
    try:
        return await create_material(body, user_id=current_user["user_id"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al generar material: {str(e)}")


@router.post("/evaluate", response_model=EvaluateMaterialResponse)
async def evaluate_material_endpoint(
    body: EvaluateMaterialRequest,
    current_user: dict = Depends(verify_token),
):
    try:
        return await evaluate_material(body, user_id=current_user["user_id"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al evaluar material: {str(e)}")
