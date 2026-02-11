from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.database import get_db, engine, Base
from app.api.v1 import api_router
from app.api.middleware.audit import audit_middleware
import redis

# Import models to create tables
from app.models.user import User, Role, Permission  # noqa
from app.models.audit import AuditLog  # noqa

# Create tables (temporaire, on utilisera Alembic plus tard)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_PREFIX}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Audit logging middleware
app.middleware("http")(audit_middleware)

# Include API routes
app.include_router(api_router, prefix=settings.API_V1_PREFIX)

# Debug: afficher toutes les routes enregistrées
print("\n🔍 Routes enregistrées:")
for route in app.routes:
    if hasattr(route, 'methods') and hasattr(route, 'path'):
        print(f"  {list(route.methods)} {route.path}")
print()


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
