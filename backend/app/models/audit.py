from sqlalchemy import Column, String, DateTime, Text, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime, timezone
import uuid
import enum

from app.core.database import Base


class ActionType(str, enum.Enum):
    """Types d'actions pour l'audit"""
    # User actions
    USER_LOGIN = "user.login"
    USER_LOGOUT = "user.logout"
    USER_CREATE = "user.create"
    USER_UPDATE = "user.update"
    USER_DELETE = "user.delete"
    USER_ACTIVATE = "user.activate"
    USER_DEACTIVATE = "user.deactivate"
    
    # Role actions
    ROLE_CREATE = "role.create"
    ROLE_UPDATE = "role.update"
    ROLE_DELETE = "role.delete"
    ROLE_ASSIGN = "role.assign"
    ROLE_REVOKE = "role.revoke"
    
    # Permission actions
    PERMISSION_CREATE = "permission.create"
    PERMISSION_UPDATE = "permission.update"
    PERMISSION_DELETE = "permission.delete"
    PERMISSION_ASSIGN = "permission.assign"
    
    # System actions
    SYSTEM_SETTINGS_UPDATE = "system.settings.update"
    SYSTEM_BACKUP = "system.backup"
    SYSTEM_MAINTENANCE = "system.maintenance"


class AuditLog(Base):
    """Modèle pour l'audit trail"""
    __tablename__ = "audit_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Action info
    action = Column(SQLEnum(ActionType), nullable=False, index=True)
    description = Column(String(500), nullable=False)
    
    # User info (qui a fait l'action)
    user_id = Column(UUID(as_uuid=True), nullable=True, index=True)
    user_email = Column(String(255), nullable=True)
    user_name = Column(String(255), nullable=True)
    
    # Target info (sur quoi l'action a été faite)
    target_type = Column(String(50), nullable=True)  # 'user', 'role', 'permission', etc.
    target_id = Column(String(255), nullable=True)
    target_name = Column(String(255), nullable=True)
    
    # Metadata
    ip_address = Column(String(50), nullable=True)
    user_agent = Column(String(500), nullable=True)
    details = Column(Text, nullable=True)  # JSON string with additional details
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False, index=True)

    def __repr__(self):
        return f"<AuditLog {self.action} by {self.user_email} at {self.created_at}>"
