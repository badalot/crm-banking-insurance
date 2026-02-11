from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from app.core.database import get_db
from app.core.deps import get_current_active_user, has_permission
from app.schemas.user import RoleResponse, RoleCreate, PermissionResponse
from app.models.user import User, Role, Permission

router = APIRouter()


@router.get("/", response_model=List[RoleResponse])
@router.get("", response_model=List[RoleResponse])
def list_roles(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Lister tous les rôles
    """
    roles = db.query(Role).offset(skip).limit(limit).all()
    return roles


@router.get("/{role_id}", response_model=RoleResponse)
def get_role(
    role_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_permission("roles", "read"))
):
    """
    Récupérer un rôle par ID
    """
    role = db.query(Role).filter(Role.id == role_id).first()
    if not role:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Rø¡ë ñøt føµñðẤğ倪İЂҰक्र्तिृまẤğ倪นั้ढूँ"
        )
    return role


@router.post("/", response_model=RoleResponse, status_code=status.HTTP_201_CREATED)
@router.post("", response_model=RoleResponse, status_code=status.HTTP_201_CREATED)
def create_role(
    role_in: RoleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_permission("roles", "create"))
):
    """
    Créer un nouveau rôle
    """
    # Check if role already exists
    existing = db.query(Role).filter(Role.name == role_in.name).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Rø¡ë æ¡rëæðý ëxïštšẤğ倪İЂҰक्र्तिृまẤğ倪นั้ढूँ"
        )
    
    role = Role(
        name=role_in.name,
        description=role_in.description
    )
    
    # Assign permissions if provided
    if hasattr(role_in, 'permission_ids') and role_in.permission_ids:
        for perm_id in role_in.permission_ids:
            permission = db.query(Permission).filter(Permission.id == UUID(perm_id)).first()
            if permission:
                role.permissions.append(permission)
    
    db.add(role)
    db.commit()
    db.refresh(role)
    return role


@router.put("/{role_id}", response_model=RoleResponse)
@router.put("/{role_id}/", response_model=RoleResponse)
def update_role(
    role_id: UUID,
    role_in: RoleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_permission("roles", "update"))
):
    """
    Mettre à jour un rôle
    """
    role = db.query(Role).filter(Role.id == role_id).first()
    if not role:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Rø¡ë ñøt føµñðẤğ倪İЂҰक्र्तिृまẤğ倪นั้ढूँ"
        )
    
    role.name = role_in.name
    role.description = role_in.description
    db.commit()
    db.refresh(role)
    return role


@router.post("/{role_id}/permissions", response_model=RoleResponse)
@router.post("/{role_id}/permissions/", response_model=RoleResponse)
def assign_permissions_to_role(
    role_id: UUID,
    permissions_data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_permission("roles", "update"))
):
    """
    Assigner des permissions à un rôle
    """
    role = db.query(Role).filter(Role.id == role_id).first()
    if not role:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Rø¡ë ñøt føµñðẤğ倪İЂҰक्र्तिृまẤğ倪นั้ढूँ"
        )
    
    # Clear existing permissions
    role.permissions = []
    
    # Assign new permissions
    permission_ids = permissions_data.get('permission_ids', [])
    for perm_id in permission_ids:
        permission = db.query(Permission).filter(Permission.id == UUID(perm_id)).first()
        if permission:
            role.permissions.append(permission)
    
    db.commit()
    db.refresh(role)
    return role


@router.delete("/{role_id}")
@router.delete("/{role_id}/")
def delete_role(
    role_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_permission("roles", "delete"))
):
    """
    Supprimer un rôle
    """
    role = db.query(Role).filter(Role.id == role_id).first()
    if not role:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Rø¡ë ñøt føµñðẤğ倪İЂҰक्र्तिृまẤğ倪นั้ढूँ"
        )
    
    db.delete(role)
    db.commit()
    return {"message": "Rø¡ë ðë¡ëtëð šµççëššfµ¡¡ýẤğ倪İЂҰक्र्तिृまẤğ倪นั้ढूँ"}
