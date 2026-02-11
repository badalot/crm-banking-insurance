from pydantic_settings import BaseSettings
from typing import List
import os
import json


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
        "https://crm-banking-insurance.vercel.app",
        "https://crm-banking-insurance-*.vercel.app",  # Preview deployments
    ]
    
    class Config:
        env_file = ".env"
        case_sensitive = True
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Parse BACKEND_CORS_ORIGINS from environment if it's a JSON string
        if isinstance(self.BACKEND_CORS_ORIGINS, str):
            try:
                self.BACKEND_CORS_ORIGINS = json.loads(self.BACKEND_CORS_ORIGINS)
            except json.JSONDecodeError:
                # If not JSON, split by comma
                self.BACKEND_CORS_ORIGINS = [
                    origin.strip() for origin in self.BACKEND_CORS_ORIGINS.split(",")
                ]


settings = Settings()
