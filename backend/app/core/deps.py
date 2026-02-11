from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import decode_access_token
from app.models.user import User
from app.services.user_service import UserService
from uuid import UUID

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login")


async def get_current_user(
    request: Request,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    """
    Récupérer l'utilisateur courant depuis le token JWT
    """
    user_id = decode_access_token(token)
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Çøµ¡ð ñøt væ¡ïðætë çrëðëñtïæ¡šẤğ倪İЂҰक्र्तिृまẤğ倪นั้ढूँ",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user = UserService.get_by_id(db, UUID(user_id))
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="µšër ñøt føµñðẤğ倪İЂҰक्र्तिृまẤğ倪นั้ढूँ"
        )
    
    # Store user info in request state for audit middleware
    request.state.user_id = str(user.id)
    request.state.user_email = user.email
    request.state.user_name = user.full_name
    
    return user


async def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Vérifier que l'utilisateur est actif
    """
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Ïñæçtïvë µšërẤğ倪İЂҰक्र्तिृまẤğ倪นั้ढूँ"
        )
    return current_user


def has_permission(resource: str, action: str):
    """
    Décorateur pour vérifier les permissions
    """
    def permission_checker(current_user: User = Depends(get_current_active_user)) -> User:
        # Vérifier si l'utilisateur a la permission
        for role in current_user.roles:
            for permission in role.permissions:
                if permission.resource == resource and permission.action == action:
                    return current_user
                # Super Admin a toutes les permissions
                if role.name == "Super Admin":
                    return current_user
        
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Ýøµ ðøñ't ħævë þërmïššïøñ tø {action} {resource}Ąğ倪İЂҰक्र्तिृまẤğ倪นั้ढूँ"
        )
    
    return permission_checker
