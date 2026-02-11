from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List, Optional
from datetime import datetime, timedelta, timezone
from app.core.database import get_db
from app.core.deps import has_permission
from app.models.user import User
from app.models.audit import AuditLog, ActionType
from app.schemas.audit import AuditLogResponse

router = APIRouter()


@router.get("/", response_model=List[AuditLogResponse])
@router.get("", response_model=List[AuditLogResponse])
def list_audit_logs(
    skip: int = 0,
    limit: int = 100,
    action: Optional[str] = Query(None, description="Filter by action type"),
    user_email: Optional[str] = Query(None, description="Filter by user email"),
    target_type: Optional[str] = Query(None, description="Filter by target type"),
    days: Optional[int] = Query(None, description="Filter by last N days"),
    db: Session = Depends(get_db),
    current_user: User = Depends(has_permission("system", "read"))
):
    """
    Lister tous les logs d'audit avec filtres optionnels
    """
    query = db.query(AuditLog)
    
    # Apply filters
    if action:
        query = query.filter(AuditLog.action == action)
    
    if user_email:
        query = query.filter(AuditLog.user_email.ilike(f"%{user_email}%"))
    
    if target_type:
        query = query.filter(AuditLog.target_type == target_type)
    
    if days:
        start_date = datetime.now(timezone.utc) - timedelta(days=days)
        query = query.filter(AuditLog.created_at >= start_date)
    
    # Order by most recent first
    query = query.order_by(desc(AuditLog.created_at))
    
    # Pagination
    logs = query.offset(skip).limit(limit).all()
    
    return logs


@router.get("/stats")
@router.get("/stats/")
def get_audit_stats(
    days: int = 7,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_permission("system", "read"))
):
    """
    Récupérer les statistiques des logs d'audit
    """
    start_date = datetime.now(timezone.utc) - timedelta(days=days)
    
    # Total logs in period
    total_logs = db.query(AuditLog).filter(
        AuditLog.created_at >= start_date
    ).count()
    
    # Logs by action type
    logs_by_action = {}
    for action_type in ActionType:
        count = db.query(AuditLog).filter(
            AuditLog.action == action_type,
            AuditLog.created_at >= start_date
        ).count()
        if count > 0:
            logs_by_action[action_type.value] = count
    
    # Top users by activity
    from sqlalchemy import func
    top_users = db.query(
        AuditLog.user_email,
        func.count(AuditLog.id).label('count')
    ).filter(
        AuditLog.created_at >= start_date,
        AuditLog.user_email.isnot(None)
    ).group_by(AuditLog.user_email).order_by(desc('count')).limit(10).all()
    
    top_users_dict = {email: count for email, count in top_users if email}
    
    return {
        "period_days": days,
        "total_logs": total_logs,
        "logs_by_action": logs_by_action,
        "top_users": top_users_dict
    }


@router.get("/actions")
@router.get("/actions/")
def get_available_actions(
    current_user: User = Depends(has_permission("system", "read"))
):
    """
    Récupérer la liste des types d'actions disponibles
    """
    return {
        "actions": [action.value for action in ActionType]
    }
