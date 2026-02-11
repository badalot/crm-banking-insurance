from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.deps import get_current_active_user
from app.schemas.user import PermissionResponse
from app.models.user import User, Permission

router = APIRouter()


@router.get("/", response_model=List[PermissionResponse])
@router.get("", response_model=List[PermissionResponse])
def list_permissions(
    skip: int = 0,
    limit: int = 200,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Lister toutes les permissions disponibles
    """
    permissions = db.query(Permission).offset(skip).limit(limit).all()
    return permissions
