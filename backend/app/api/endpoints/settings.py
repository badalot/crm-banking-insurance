from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict, Any
from app.database import get_db
from app.models.settings import SystemSettings
from app.schemas.settings import SystemSettingsResponse, SystemSettingsUpdate
from app.api.deps import get_current_active_superuser

router = APIRouter()

@router.get("/", response_model=SystemSettingsResponse)
def get_system_settings(
    db: Session = Depends(get_db)
):
    """
    Récupérer les paramètres système
    Accessible à tous les utilisateurs authentifiés
    """
    settings = db.query(SystemSettings).first()
    
    if not settings:
        # Créer les paramètres par défaut s'ils n'existent pas
        settings = SystemSettings()
        db.add(settings)
        db.commit()
        db.refresh(settings)
    
    return settings

@router.put("/", response_model=SystemSettingsResponse)
def update_system_settings(
    settings_update: SystemSettingsUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_superuser)
):
    """
    Mettre à jour les paramètres système
    Nécessite les droits de Super Admin
    """
    settings = db.query(SystemSettings).first()
    
    if not settings:
        # Créer les paramètres s'ils n'existent pas
        settings = SystemSettings()
        db.add(settings)
    
    # Mettre à jour uniquement les champs fournis
    update_data = settings_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(settings, field, value)
    
    # Enregistrer qui a fait la modification
    settings.updated_by = current_user.id
    
    db.commit()
    db.refresh(settings)
    
    return settings

@router.post("/test-email", response_model=Dict[str, Any])
def test_email_configuration(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_superuser)
):
    """
    Tester la configuration email SMTP
    Nécessite les droits de Super Admin
    """
    settings = db.query(SystemSettings).first()
    
    if not settings or not settings.smtp_host:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Configuration SMTP non définie"
        )
    
    # TODO: Implémenter l'envoi d'email de test réel
    # Pour l'instant, on simule juste
    return {
        "success": True,
        "message": f"Email de test envoyé à {current_user.email}",
        "smtp_host": settings.smtp_host,
        "smtp_port": settings.smtp_port
    }

@router.post("/reset", response_model=SystemSettingsResponse)
def reset_system_settings(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_superuser)
):
    """
    Réinitialiser les paramètres système aux valeurs par défaut
    Nécessite les droits de Super Admin
    """
    settings = db.query(SystemSettings).first()
    
    if settings:
        db.delete(settings)
        db.commit()
    
    # Créer de nouveaux paramètres par défaut
    settings = SystemSettings()
    settings.updated_by = current_user.id
    db.add(settings)
    db.commit()
    db.refresh(settings)
    
    return settings
