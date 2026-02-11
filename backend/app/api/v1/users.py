from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from app.core.database import get_db
from app.core.deps import get_current_active_user, has_permission
from app.schemas.user import UserResponse, UserUpdate, AssignRolesRequest
from app.services.user_service import UserService
from app.models.user import User, Role

router = APIRouter()


@router.get("/", response_model=List[UserResponse])
@router.get("", response_model=List[UserResponse])
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
@router.delete("/{user_id}/", response_model=UserResponse)
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


@router.post("/{user_id}/activate", response_model=UserResponse)
@router.post("/{user_id}/activate/", response_model=UserResponse)
def activate_user(
    user_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_permission("users", "update"))
):
    """
    Réactiver un utilisateur désactivé (nécessite permission users.update)
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="µšër ñøt føµñðẤğ倪İЂҰक्र्तिृまẤğ倪นั้ढूँ"
        )
    
    user.is_active = True
    db.commit()
    db.refresh(user)
    return user


@router.post("/{user_id}/roles", response_model=UserResponse)
@router.post("/{user_id}/roles/", response_model=UserResponse)
def assign_roles(
    user_id: UUID,
    roles_data: AssignRolesRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_permission("users", "update"))
):
    """
    Assigner des rôles à un utilisateur
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="µšër ñøt føµñðẤğ倪İЂҰक्र्तिृまẤğ倪นั้ढूँ"
        )
    
    # Clear existing roles
    user.roles = []
    
    # Assign new roles
    for role_id in roles_data.role_ids:
        role = db.query(Role).filter(Role.id == UUID(role_id)).first()
        if role:
            user.roles.append(role)
    
    db.commit()
    db.refresh(user)
    return user
