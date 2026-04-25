from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from app.database import supabase

router = APIRouter()


class RegisterRequest(BaseModel):
    email: str
    password: str
    full_name: str
    institution: str | None = None


class LoginRequest(BaseModel):
    email: str
    password: str


@router.post("/register", status_code=status.HTTP_200_OK)
async def register(body: RegisterRequest):
    try:
        res = supabase.auth.sign_up({"email": body.email, "password": body.password})
        if res.user is None:
            raise HTTPException(status_code=400, detail="Error al registrar usuario")
        supabase.table("user_profiles").insert({
            "id": res.user.id,
            "full_name": body.full_name,
            "institution": body.institution,
        }).execute()
        return {
            "user_id": res.user.id,
            "email": res.user.email,
            "access_token": res.session.access_token if res.session else None,
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/login", status_code=status.HTTP_200_OK)
async def login(body: LoginRequest):
    try:
        res = supabase.auth.sign_in_with_password({"email": body.email, "password": body.password})
        if res.session is None:
            raise HTTPException(status_code=401, detail="Credenciales inválidas")
        return {
            "access_token": res.session.access_token,
            "token_type": "bearer",
            "user_id": res.user.id,
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail="Credenciales inválidas")
