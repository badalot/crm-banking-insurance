from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class SystemSettingsBase(BaseModel):
    """Schéma de base pour les paramètres système"""
    # Généraux
    site_name: Optional[str] = Field(None, max_length=255)
    site_description: Optional[str] = None
    support_email: Optional[EmailStr] = None
    support_phone: Optional[str] = Field(None, max_length=50)
    timezone: Optional[str] = Field(None, max_length=100)
    language: Optional[str] = Field(None, max_length=10)
    date_format: Optional[str] = Field(None, max_length=50)
    
    # Sécurité
    session_timeout: Optional[int] = Field(None, ge=5, le=1440)
    password_min_length: Optional[int] = Field(None, ge=6, le=32)
    password_require_uppercase: Optional[bool] = None
    password_require_lowercase: Optional[bool] = None
    password_require_numbers: Optional[bool] = None
    password_require_special: Optional[bool] = None
    max_login_attempts: Optional[int] = Field(None, ge=1, le=10)
    lockout_duration: Optional[int] = Field(None, ge=5, le=120)
    two_factor_auth_enabled: Optional[bool] = None
    
    # Email/SMTP
    smtp_host: Optional[str] = Field(None, max_length=255)
    smtp_port: Optional[int] = Field(None, ge=1, le=65535)
    smtp_username: Optional[str] = Field(None, max_length=255)
    smtp_password: Optional[str] = Field(None, max_length=255)
    smtp_use_tls: Optional[bool] = None
    smtp_from_email: Optional[EmailStr] = None
    smtp_from_name: Optional[str] = Field(None, max_length=255)
    
    # Fonctionnalités
    enable_audit_log: Optional[bool] = None
    enable_email_notifications: Optional[bool] = None
    enable_user_registration: Optional[bool] = None
    enable_password_reset: Optional[bool] = None
    maintenance_mode: Optional[bool] = None
    maintenance_message: Optional[str] = None

class SystemSettingsCreate(SystemSettingsBase):
    """Schéma pour créer les paramètres système (initialisation)"""
    pass

class SystemSettingsUpdate(SystemSettingsBase):
    """Schéma pour mettre à jour les paramètres système"""
    pass

class SystemSettingsInDB(SystemSettingsBase):
    """Schéma pour les paramètres système en DB"""
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    updated_by: Optional[int] = None
    
    class Config:
        from_attributes = True

class SystemSettingsResponse(SystemSettingsInDB):
    """Schéma de réponse pour les paramètres système"""
    pass
