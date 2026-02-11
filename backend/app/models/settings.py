from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.sql import func
from app.database import Base

class SystemSettings(Base):
    """Modèle pour les paramètres système"""
    __tablename__ = "system_settings"

    id = Column(Integer, primary_key=True, index=True)
    
    # Paramètres généraux
    site_name = Column(String(255), default="CRM Banking & Insurance")
    site_description = Column(Text, nullable=True)
    support_email = Column(String(255), nullable=True)
    support_phone = Column(String(50), nullable=True)
    timezone = Column(String(100), default="UTC")
    language = Column(String(10), default="fr")
    date_format = Column(String(50), default="DD/MM/YYYY")
    
    # Paramètres de sécurité
    session_timeout = Column(Integer, default=30)  # minutes
    password_min_length = Column(Integer, default=8)
    password_require_uppercase = Column(Boolean, default=True)
    password_require_lowercase = Column(Boolean, default=True)
    password_require_numbers = Column(Boolean, default=True)
    password_require_special = Column(Boolean, default=True)
    max_login_attempts = Column(Integer, default=5)
    lockout_duration = Column(Integer, default=15)  # minutes
    two_factor_auth_enabled = Column(Boolean, default=False)
    
    # Paramètres Email/SMTP
    smtp_host = Column(String(255), nullable=True)
    smtp_port = Column(Integer, default=587)
    smtp_username = Column(String(255), nullable=True)
    smtp_password = Column(String(255), nullable=True)
    smtp_use_tls = Column(Boolean, default=True)
    smtp_from_email = Column(String(255), nullable=True)
    smtp_from_name = Column(String(255), nullable=True)
    
    # Paramètres de fonctionnalités
    enable_audit_log = Column(Boolean, default=True)
    enable_email_notifications = Column(Boolean, default=True)
    enable_user_registration = Column(Boolean, default=False)
    enable_password_reset = Column(Boolean, default=True)
    maintenance_mode = Column(Boolean, default=False)
    maintenance_message = Column(Text, nullable=True)
    
    # Métadonnées
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    updated_by = Column(Integer, nullable=True)  # User ID qui a fait la dernière modification
    
    def __repr__(self):
        return f"<SystemSettings(id={self.id}, site_name='{self.site_name}')>"
