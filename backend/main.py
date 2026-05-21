from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from dotenv import load_dotenv
import os

# Load .env from the backend directory (where this file lives)
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

from db import init_db

# Import routers
from routes.ats import router as ats_router
from routes.resume import router as resume_router

from routes.auth import router as auth_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield

app = FastAPI(title="Techify API", version="2.0.0", lifespan=lifespan)

# ─── CORS ─────────────────────────────────────────────────────────────────────
# Read allowed origins from environment; fallback to common dev URLs
_raw_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000,http://127.0.0.1:3001,https://techify.vercel.app"
)
allowed_origins = [o.strip() for o in _raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router,      prefix="/api/auth",         tags=["Auth"])
app.include_router(resume_router,    prefix="/api/resume",       tags=["Resume"])
app.include_router(ats_router,       prefix="/api/ats",          tags=["ATS"])



@app.get("/")
async def root():
    return {"message": "Techify Backend API Online.", "version": "2.0.0", "docs": "/docs"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}