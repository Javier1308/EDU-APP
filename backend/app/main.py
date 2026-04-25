from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routes import auth, materials, sources

app = FastAPI(title="EduMVP API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(materials.router, prefix="/materials", tags=["materials"])
app.include_router(sources.router, prefix="/sources", tags=["sources"])


@app.get("/health")
def health():
    return {"status": "ok"}
