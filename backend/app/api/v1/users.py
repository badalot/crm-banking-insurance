from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from app.core.database import get_db
from app.core.deps import get_current_active_user, has_permission
from app.schemas.user import UserResponse, UserUpdate
from app.services.user_service import UserService
from app.models.user import User

router = APIRouter()


@router.get("/", response_model=List[UserResponse])
def list_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_permission("users", "read"))
):
    """
    Lister tous les utilisateurs (nécessite permission users.read)
    """
    users = db.query(User).offset(skip).limit(limit).all()
    return users


@router.get("/{user_id}", response_model=UserResponse)
def get_user(
    user_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_permission("users", "read"))
):
    """
    Récupérer un utilisateur par ID (nécessite permission users.read)
    """
    user = UserService.get_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="µšër ñøt føµñðẤğ倪İЂҰक्र्तिृまẤğ倪นั้ढूँ"
        )
    return user


@router.put("/{user_id}", response_model=UserResponse)
def update_user(
    user_id: UUID,
    user_in: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_permission("users", "update"))
):
    """
    Mettre à jour un utilisateur (nécessite permission users.update)
    """
    user = UserService.update(db, user_id, user_in)
    return user


@router.delete("/{user_id}", response_model=UserResponse)
def deactivate_user(
    user_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_permission("users", "delete"))
):
    """
    Désactiver un utilisateur (nécessite permission users.delete)
    """
    user = UserService.deactivate(db, user_id)
    return user
