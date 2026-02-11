from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.database import get_db, engine, Base
from app.api.v1 import api_router
import redis
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response

# Create tables (temporaire, on utilisera Alembic plus tard)
Base.metadata.create_all(bind=engine)


# Middleware pour gérer les trailing slashes sans redirection HTTP
class TrailingSlashMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Si l'URL ne se termine pas par / et n'est pas un fichier statique
        if not request.url.path.endswith('/') and '.' not in request.url.path.split('/')[-1]:
            # Ajouter le trailing slash directement sans redirection
            request.scope['path'] = request.url.path + '/'
        
        response = await call_next(request)
        return response


app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_PREFIX}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Ajouter le middleware de trailing slash AVANT CORS
app.add_middleware(TrailingSlashMiddleware)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix=settings.API_V1_PREFIX)


# Routes de base
@app.get("/")
async def root():
    return {
        "message": "Banking & Insurance CRM API",
        "version": "1.0.0",
        "environment": settings.ENVIRONMENT,
        "docs": "/docs"
    }


@app.get("/health")
async def health_check(db: Session = Depends(get_db)):
    """Health check endpoint pour Railway"""
    try:
        # Test database connection
        from sqlalchemy import text
        db.execute(text("SELECT 1"))
        
        # Test Redis connection
        r = redis.from_url(settings.REDIS_URL)
        r.ping()
        
        return {
            "status": "healthy",
            "database": "connected",
            "redis": "connected"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e)
        }


@app.get(f"{settings.API_V1_PREFIX}/ping")
async def ping():
    return {"message": "pong"}
