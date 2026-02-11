from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from uuid import UUID


class AuditLogBase(BaseModel):
    action: str
    description: str
    user_id: Optional[UUID] = None
    user_email: Optional[str] = None
    user_name: Optional[str] = None
    target_type: Optional[str] = None
    target_id: Optional[str] = None
    target_name: Optional[str] = None
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    details: Optional[str] = None


class AuditLogCreate(AuditLogBase):
    pass


class AuditLogResponse(AuditLogBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True
