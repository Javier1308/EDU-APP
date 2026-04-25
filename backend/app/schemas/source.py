from pydantic import BaseModel


class SourceResponse(BaseModel):
    id: str
    name: str
    type: str
    is_active: bool
    created_at: str


class SourceListResponse(BaseModel):
    sources: list[SourceResponse]


class UploadSourceResponse(BaseModel):
    source_id: str
    name: str
    file_url: str
    status: str
