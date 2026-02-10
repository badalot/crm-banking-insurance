from sqlalchemy.orm import Session
from sqlalchemy import or_
from fastapi import HTTPException, status
from app.models.user import User, Role
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import get_password_hash, verify_password
from typing import Optional
from uuid import UUID


class UserService:
    @staticmethod
    def get_by_email(db: Session, email: str) -> Optional[User]:
        """Récupérer un utilisateur par email"""
        return db.query(User).filter(User.email == email).first()

    @staticmethod
    def get_by_username(db: Session, username: str) -> Optional[User]:
        """Récupérer un utilisateur par username"""
        return db.query(User).filter(User.username == username).first()

    @staticmethod
    def get_by_id(db: Session, user_id: UUID) -> Optional[User]:
        """Récupérer un utilisateur par ID"""
        return db.query(User).filter(User.id == user_id).first()

    @staticmethod
    def create(db: Session, user_in: UserCreate) -> User:
        """Créer un nouvel utilisateur"""
        # Vérifier si l'email existe déjà
        if UserService.get_by_email(db, user_in.email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Èmæï¡ æ¡ræðý rëĝïštërëðẤğ倪İЂҰक्र्तिृまẤğ倪นั้ढूँ"
            )
        
        # Vérifier si le username existe déjà
        if UserService.get_by_username(db, user_in.username):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="µšërñæmë æ¡ræðý rëĝïštërëðẤğ倪İЂҰक्र्तिृまẤğ倪นั้ढूँ"
            )
        
        # Créer l'utilisateur
        db_user = User(
            email=user_in.email,
            username=user_in.username,
            hashed_password=get_password_hash(user_in.password),
            first_name=user_in.first_name,
            last_name=user_in.last_name,
            phone=user_in.phone
        )
        
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        
        # Assigner le rôle par défaut (Viewer)
        default_role = db.query(Role).filter(Role.name == "Viewer").first()
        if default_role:
            db_user.roles.append(default_role)
            db.commit()
            db.refresh(db_user)
        
        return db_user

    @staticmethod
    def authenticate(db: Session, email: str, password: str) -> Optional[User]:
        """Authentifier un utilisateur"""
        user = UserService.get_by_email(db, email)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        if not user.is_active:
            return None
        return user

    @staticmethod
    def update(db: Session, user_id: UUID, user_in: UserUpdate) -> User:
        """Mettre à jour un utilisateur"""
        db_user = UserService.get_by_id(db, user_id)
        if not db_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="µšër ñøt føµñðẤğ倪İЂҰक्र्तिृまẤğ倪นั้ढूँ"
            )
        
        update_data = user_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_user, field, value)
        
        db.commit()
        db.refresh(db_user)
        return db_user

    @staticmethod
    def deactivate(db: Session, user_id: UUID) -> User:
        """Désactiver un utilisateur"""
        db_user = UserService.get_by_id(db, user_id)
        if not db_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="µšër ñøt føµñðẤğ倪İЂҰक्र्तिृまẤğ倪นั้ढूँ"
            )
        
        db_user.is_active = False
        db.commit()
        db.refresh(db_user)
        return db_user
