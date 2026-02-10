from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    # Environment
    ENVIRONMENT: str = "development"
    
    # Project
    PROJECT_NAME: str = "Banking & Insurance CRM API"
    API_V1_PREFIX: str = "/api/v1"
    
    # Database
    DATABASE_URL: str
    
    # Redis
    REDIS_URL: str
    
    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:8000",
    ]
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
