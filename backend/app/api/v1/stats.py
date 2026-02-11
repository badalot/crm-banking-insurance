from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from app.core.database import get_db
from app.core.deps import has_permission
from app.models.user import User, Role

router = APIRouter()


@router.get("/")
@router.get("")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(has_permission("system", "read"))
):
    """
    Récupérer les statistiques du dashboard pour Super Admin
    """
    # Total users
    total_users = db.query(User).count()
    active_users = db.query(User).filter(User.is_active == True).count()
    inactive_users = total_users - active_users
    
    # Users created in last 30 days
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    new_users_last_month = db.query(User).filter(
        User.created_at >= thirty_days_ago
    ).count()
    
    # Total roles
    total_roles = db.query(Role).count()
    
    # Users by role
    users_by_role = db.query(
        Role.name,
        func.count(User.id).label('count')
    ).join(User.roles).group_by(Role.name).all()
    
    users_by_role_dict = {role: count for role, count in users_by_role}
    
    # Recent users (last 10)
    recent_users = db.query(User).order_by(User.created_at.desc()).limit(10).all()
    recent_users_data = [
        {
            "id": str(user.id),
            "email": user.email,
            "username": user.username,
            "full_name": f"{user.first_name} {user.last_name}",
            "created_at": user.created_at.isoformat(),
            "is_active": user.is_active,
            "roles": [role.name for role in user.roles]
        }
        for user in recent_users
    ]
    
    return {
        "total_users": total_users,
        "active_users": active_users,
        "inactive_users": inactive_users,
        "new_users_last_month": new_users_last_month,
        "total_roles": total_roles,
        "users_by_role": users_by_role_dict,
        "recent_users": recent_users_data,
        "last_updated": datetime.utcnow().isoformat()
    }


@router.get("/activity")
@router.get("/activity/")
def get_activity_stats(
    days: int = 7,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_permission("system", "read"))
):
    """
    Récupérer les statistiques d'activité (nombre d'utilisateurs créés par jour)
    """
    start_date = datetime.utcnow() - timedelta(days=days)
    
    # Users created per day
    activity_data = []
    for i in range(days):
        day_start = start_date + timedelta(days=i)
        day_end = day_start + timedelta(days=1)
        
        count = db.query(User).filter(
            User.created_at >= day_start,
            User.created_at < day_end
        ).count()
        
        activity_data.append({
            "date": day_start.strftime("%Y-%m-%d"),
            "count": count
        })
    
    return {
        "period_days": days,
        "activity": activity_data
    }
