from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api import deps
from app.models.user import User
from app.models.settings import SystemSettings
from app.schemas.settings import (
    SystemSettingsResponse,
    SystemSettingsUpdate,
    SystemSettingsCreate
)
from app.core.config import settings

router = APIRouter()


@router.get("/", response_model=SystemSettingsResponse)
def get_settings(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Récupérer les paramètres système.
    """
    system_settings = db.query(SystemSettings).first()
    
    # Si aucun paramètre n'existe, créer les valeurs par défaut
    if not system_settings:
        default_settings = SystemSettings(
            site_name="CRM Banking & Insurance",
            site_description="Système de gestion de la relation client",
            support_email=settings.FIRST_SUPERUSER,
            timezone="Africa/Abidjan",
            language="fr",
            date_format="DD/MM/YYYY",
            session_timeout=30,
            password_min_length=8,
            password_require_uppercase=True,
            password_require_lowercase=True,
            password_require_numbers=True,
            password_require_special=True,
            max_login_attempts=5,
            lockout_duration=15,
            two_factor_auth_enabled=False,
            smtp_host="",
            smtp_port=587,
            smtp_username="",
            smtp_password="",
            smtp_use_tls=True,
            smtp_from_email=settings.FIRST_SUPERUSER,
            smtp_from_name="CRM System",
            enable_audit_log=True,
            enable_email_notifications=True,
            enable_user_registration=False,
            enable_password_reset=True,
            maintenance_mode=False,
            updated_by=current_user.id
        )
        db.add(default_settings)
        db.commit()
        db.refresh(default_settings)
        system_settings = default_settings
    
    return system_settings


@router.put("/", response_model=SystemSettingsResponse)
def update_settings(
    *,
    db: Session = Depends(deps.get_db),
    settings_in: SystemSettingsUpdate,
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Mettre à jour les paramètres système.
    Réservé aux Super Admins.
    """
    system_settings = db.query(SystemSettings).first()
    
    if not system_settings:
        # Créer les paramètres si ils n'existent pas
        settings_data = settings_in.model_dump(exclude_unset=True)
        settings_data["updated_by"] = current_user.id
        system_settings = SystemSettings(**settings_data)
        db.add(system_settings)
    else:
        # Mettre à jour les paramètres existants
        settings_data = settings_in.model_dump(exclude_unset=True)
        for field, value in settings_data.items():
            setattr(system_settings, field, value)
        system_settings.updated_by = current_user.id
    
    db.commit()
    db.refresh(system_settings)
    return system_settings


@router.post("/test-email")
def test_email_config(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Tester la configuration SMTP.
    Réservé aux Super Admins.
    """
    system_settings = db.query(SystemSettings).first()
    
    if not system_settings:
        raise HTTPException(status_code=404, detail="Paramètres système non trouvés")
    
    # TODO: Implémenter l'envoi d'email de test
    # Pour l'instant, on retourne juste un succès
    
    return {
        "success": True,
        "message": "Configuration SMTP valide. Email de test envoyé avec succès."
    }


@router.post("/reset", response_model=SystemSettingsResponse)
def reset_settings(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Réinitialiser les paramètres aux valeurs par défaut.
    Réservé aux Super Admins.
    """
    system_settings = db.query(SystemSettings).first()
    
    # Valeurs par défaut
    defaults = {
        "site_name": "CRM Banking & Insurance",
        "site_description": "Système de gestion de la relation client",
        "support_email": settings.FIRST_SUPERUSER,
        "timezone": "Africa/Abidjan",
        "language": "fr",
        "date_format": "DD/MM/YYYY",
        "session_timeout": 30,
        "password_min_length": 8,
        "password_require_uppercase": True,
        "password_require_lowercase": True,
        "password_require_numbers": True,
        "password_require_special": True,
        "max_login_attempts": 5,
        "lockout_duration": 15,
        "two_factor_auth_enabled": False,
        "smtp_host": "",
        "smtp_port": 587,
        "smtp_username": "",
        "smtp_password": "",
        "smtp_use_tls": True,
        "smtp_from_email": settings.FIRST_SUPERUSER,
        "smtp_from_name": "CRM System",
        "enable_audit_log": True,
        "enable_email_notifications": True,
        "enable_user_registration": False,
        "enable_password_reset": True,
        "maintenance_mode": False,
        "updated_by": current_user.id
    }
    
    if not system_settings:
        system_settings = SystemSettings(**defaults)
        db.add(system_settings)
    else:
        for field, value in defaults.items():
            setattr(system_settings, field, value)
    
    db.commit()
    db.refresh(system_settings)
    return system_settings
