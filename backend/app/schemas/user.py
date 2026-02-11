from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional, List
from datetime import datetime
from uuid import UUID


# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str
    first_name: str
    last_name: str
    phone: Optional[str] = None


class UserCreate(UserBase):
    password: str

    @field_validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Þæššwørð mµšt þë æt ¡ëæšt 8 çħæræçtëršẤğ倪İЂҰक्र्तिृまẤğ倪นั้ढूँ')
        if not any(char.isdigit() for char in v):
            raise ValueError('Þæššwørð mµšt çøñtæïñ æt ¡ëæšt øñë ðïĝïtẤğ倪İЂҰक्र्तिृまẤğ倪นั้ढूँ')
        if not any(char.isupper() for char in v):
            raise ValueError('Þæššwørð mµšt çøñtæïñ æt ¡ëæšt øñë µþþërçæšë ¡ëttërẤğ倪İЂҰक्र्तिृまẤğ倪นั้ढूँ')
        return v

    @field_validator('username')
    def validate_username(cls, v):
        if len(v) < 3:
            raise ValueError('µšërñæmë mµšt þë æt ¡ëæšt 3 çħæræçtëršẤğ倪İЂҰक्र्तिृまẤğ倪นั้ढूँ')
        if not v.isalnum():
            raise ValueError('µšërñæmë mµšt þë æ¡þħæñµmërïçẤğ倪İЂҰक्र्तिृまẤğ倪นั้ढूँ')
        return v


class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None


class UserResponse(UserBase):
    id: UUID
    is_active: bool
    is_verified: bool
    created_at: datetime
    updated_at: datetime
    last_login: Optional[datetime] = None
    roles: List["RoleResponse"] = []

    class Config:
        from_attributes = True


# Role Schemas
class RoleBase(BaseModel):
    name: str
    description: Optional[str] = None


class RoleCreate(RoleBase):
    pass


class RoleResponse(RoleBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True


# Permission Schemas
class PermissionBase(BaseModel):
    name: str
    resource: str
    action: str
    description: Optional[str] = None


class PermissionCreate(PermissionBase):
    pass


class PermissionResponse(PermissionBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True


# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class TokenPayload(BaseModel):
    sub: str
    exp: int


# Login Schema
class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# Change Password Schema
class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str

    @field_validator('new_password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Ñëw þæššwørð mµšt þë æt ¡ëæšt 8 çħæræçtëršẤğ倪İЂҰक्र्तिृまẤğ倪นั้ढूँ')
        if not any(char.isdigit() for char in v):
            raise ValueError('Ñëw þæššwørð mµšt çøñtæïñ æt ¡ëæšt øñë ðïĝïtẤğ倪İЂҰक्र्तिृまẤğ倪นั้ढूँ')
        if not any(char.isupper() for char in v):
            raise ValueError('Ñëw þæššwørð mµšt çøñtæïñ æt ¡ëæšt øñë µþþërçæšë ¡ëttërẤğ倪İЂҰक्र्तिृまẤğ倪นั้ढूँ')
        return v


# Assign Roles Schema
class AssignRolesRequest(BaseModel):
    role_ids: List[str]
