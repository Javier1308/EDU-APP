from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from app.dependencies import verify_token
from app.database import supabase, supabase_admin
from app.schemas.source import SourceListResponse, UploadSourceResponse
from app.utils.file_parser import _extract_pdf, _extract_docx
import uuid

router = APIRouter()

ALLOWED_TYPES = {"application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"}
MAX_SIZE = 10 * 1024 * 1024  # 10MB


@router.get("", response_model=SourceListResponse)
async def list_sources(
    subject: str | None = None,
    active: bool = True,
    current_user: dict = Depends(verify_token),
):
    query = supabase.table("sources").select("id, name, type, is_active, created_at").eq("is_active", active)
    data = query.execute().data or []
    return SourceListResponse(sources=data)


@router.post("/upload", response_model=UploadSourceResponse)
async def upload_source(
    file: UploadFile = File(...),
    name: str = Form(...),
    type: str = Form("document"),
    current_user: dict = Depends(verify_token),
):
    content = await file.read()
    if len(content) > MAX_SIZE:
        raise HTTPException(status_code=413, detail="Archivo mayor a 10MB")
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=415, detail="Solo se aceptan PDF y DOCX")

    if file.content_type == "application/pdf":
        text = _extract_pdf(content)
    else:
        text = _extract_docx(content)

    file_path = f"sources/{uuid.uuid4()}/{file.filename}"
    supabase_admin.storage.from_("sources").upload(file_path, content)
    file_url = supabase_admin.storage.from_("sources").get_public_url(file_path)

    result = supabase.table("sources").insert({
        "name": name,
        "type": type,
        "content": text,
        "file_url": file_url,
        "is_active": True,
    }).execute()
    source = result.data[0]

    return UploadSourceResponse(
        source_id=source["id"],
        name=source["name"],
        file_url=file_url,
        status="procesado",
    )
