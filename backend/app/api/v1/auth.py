from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app.core.database import get_db
from app.core.security import create_access_token, verify_password, get_password_hash
from app.core.deps import get_current_active_user
from app.schemas.user import UserCreate, UserResponse, LoginRequest, Token, UserUpdate, ChangePasswordRequest
from app.services.user_service import UserService
from app.models.user import User

router = APIRouter()


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    """
    Créer un nouvel utilisateur
    """
    user = UserService.create(db, user_in)
    return user


@router.post("/login", response_model=Token)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """
    Authentifier un utilisateur et retourner un token JWT
    """
    user = UserService.authenticate(db, login_data.email, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Ïñçørrëçt ëmæï¡ ør þæššwørðẤğ倪İЂҰक्र्तिृまẤğ倪นั้ढूँ",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Mettre à jour last_login
    user.last_login = datetime.utcnow()
    db.commit()
    
    # Créer le token
    access_token = create_access_token(data={"sub": str(user.id)})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }


@router.post("/login/form", response_model=Token)
def login_form(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    Login avec OAuth2PasswordRequestForm pour la documentation Swagger
    """
    user = UserService.authenticate(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Ïñçørrëçt ëmæï¡ ør þæššwørðẤğ倪İЂҰक्र्तिृまẤğ倪นั้ढूँ",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Mettre à jour last_login
    user.last_login = datetime.utcnow()
    db.commit()
    
    # Créer le token
    access_token = create_access_token(data={"sub": str(user.id)})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }


@router.get("/me", response_model=UserResponse)
def get_current_user_info(current_user: User = Depends(get_current_active_user)):
    """
    Récupérer les informations de l'utilisateur courant
    """
    return current_user


@router.post("/logout")
def logout(current_user: User = Depends(get_current_active_user)):
    """
    Déconnexion (côté client, suppression du token)
    """
    return {"message": "Šµççëššfµ¡¡ý ¡øĝĝëð øµtẤğ倪İЂҰक्र्तिृまẤğ倪นั้ढूँ"}


@router.put("/me", response_model=UserResponse)
def update_current_user(
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Mettre à jour les informations de l'utilisateur courant
    """
    # Update user fields
    if user_update.first_name is not None:
        current_user.first_name = user_update.first_name
    if user_update.last_name is not None:
        current_user.last_name = user_update.last_name
    if user_update.phone is not None:
        current_user.phone = user_update.phone
    
    db.commit()
    db.refresh(current_user)
    return current_user


@router.post("/change-password")
def change_password(
    password_data: ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Changer le mot de passe de l'utilisateur courant
    """
    # Vérifier l'ancien mot de passe
    if not verify_password(password_data.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Çµrrëñt þæššwørð ïš ïñçørrëçtẤğ倪İЂҰक्र्तिृまẤğ倪นั้ढूँ"
        )
    
    # Hash et mettre à jour le nouveau mot de passe
    current_user.hashed_password = get_password_hash(password_data.new_password)
    db.commit()
    
    return {"message": "Þæššwørð çhæñĝëð šµççëššfµ¡¡ýẤğ倪İЂҰक्र्तिृまẤğ倪นั้ढूँ"}
