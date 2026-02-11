"""
Audit logging middleware for automatic action tracking
"""
from fastapi import Request, Response
from sqlalchemy.orm import Session
from app.models.audit import AuditLog, ActionType
from app.core.database import SessionLocal
from datetime import datetime, timezone
import json


async def log_audit_event(
    action: ActionType,
    description: str,
    request: Request,
    user_id: str | None = None,
    user_email: str | None = None,
    user_name: str | None = None,
    target_type: str | None = None,
    target_id: str | None = None,
    target_name: str | None = None,
    details: dict | None = None,
):
    """
    Log an audit event to the database
    """
    db = SessionLocal()
    try:
        # Get client IP
        client_host = request.client.host if request.client else None
        forwarded_for = request.headers.get("x-forwarded-for")
        ip_address = forwarded_for.split(",")[0] if forwarded_for else client_host
        
        # Get user agent
        user_agent = request.headers.get("user-agent")
        
        # Create audit log
        audit_log = AuditLog(
            action=action,
            description=description,
            user_id=user_id,
            user_email=user_email,
            user_name=user_name,
            target_type=target_type,
            target_id=target_id,
            target_name=target_name,
            ip_address=ip_address,
            user_agent=user_agent,
            details=json.dumps(details) if details else None,
            created_at=datetime.now(timezone.utc),
        )
        
        db.add(audit_log)
        db.commit()
    except Exception as e:
        print(f"Error logging audit event: {e}")
        db.rollback()
    finally:
        db.close()


def get_action_from_route(method: str, path: str) -> ActionType | None:
    """
    Determine the action type based on the HTTP method and route path
    """
    # User routes
    if "/users" in path:
        if method == "POST" and not any(x in path for x in ["activate", "deactivate"]):
            return ActionType.USER_CREATE
        elif method == "PUT" or method == "PATCH":
            return ActionType.USER_UPDATE
        elif method == "DELETE":
            return ActionType.USER_DELETE
        elif "activate" in path:
            return ActionType.USER_ACTIVATE
        elif "deactivate" in path:
            return ActionType.USER_DEACTIVATE
    
    # Role routes
    elif "/roles" in path:
        if method == "POST":
            return ActionType.ROLE_CREATE
        elif method == "PUT" or method == "PATCH":
            return ActionType.ROLE_UPDATE
        elif method == "DELETE":
            return ActionType.ROLE_DELETE
        elif "permissions" in path:
            return ActionType.PERMISSION_ASSIGN
    
    # Permission routes
    elif "/permissions" in path:
        if method == "POST":
            return ActionType.PERMISSION_CREATE
        elif method == "PUT" or method == "PATCH":
            return ActionType.PERMISSION_UPDATE
        elif method == "DELETE":
            return ActionType.PERMISSION_DELETE
    
    # Auth routes
    elif "/login" in path and method == "POST":
        return ActionType.USER_LOGIN
    elif "/logout" in path:
        return ActionType.USER_LOGOUT
    
    # Settings routes
    elif "/settings" in path:
        if method == "PUT" or method == "PATCH":
            return ActionType.SETTINGS_UPDATE
    
    return None


async def audit_middleware(request: Request, call_next):
    """
    Middleware to automatically log significant actions
    """
    # Skip audit logging for certain routes
    skip_routes = [
        "/docs",
        "/redoc",
        "/openapi.json",
        "/audit",  # Don't log audit log queries
        "/stats",  # Don't log stats queries
        "/health",
    ]
    
    if any(route in request.url.path for route in skip_routes):
        return await call_next(request)
    
    # Only log write operations (POST, PUT, PATCH, DELETE)
    if request.method not in ["POST", "PUT", "PATCH", "DELETE"]:
        return await call_next(request)
    
    # Determine action type
    action = get_action_from_route(request.method, request.url.path)
    
    if not action:
        return await call_next(request)
    
    # Get user info from request state (set by auth dependency)
    user_id = getattr(request.state, "user_id", None)
    user_email = getattr(request.state, "user_email", None)
    user_name = getattr(request.state, "user_name", None)
    
    # Process the request
    response: Response = await call_next(request)
    
    # Only log successful operations (2xx status codes)
    if 200 <= response.status_code < 300:
        # Generate description based on action
        description = generate_description(action, request)
        
        # Extract target info from path if available
        target_type, target_id = extract_target_info(request.url.path)
        
        # Log the event asynchronously (fire and forget)
        try:
            await log_audit_event(
                action=action,
                description=description,
                request=request,
                user_id=user_id,
                user_email=user_email,
                user_name=user_name,
                target_type=target_type,
                target_id=target_id,
            )
        except Exception as e:
            print(f"Failed to log audit event: {e}")
    
    return response


def generate_description(action: ActionType, request: Request) -> str:
    """
    Generate a human-readable description based on the action
    """
    action_descriptions = {
        ActionType.USER_CREATE: "Nouvel utilisateur créé",
        ActionType.USER_UPDATE: "Utilisateur mis à jour",
        ActionType.USER_DELETE: "Utilisateur supprimé",
        ActionType.USER_ACTIVATE: "Utilisateur activé",
        ActionType.USER_DEACTIVATE: "Utilisateur désactivé",
        ActionType.USER_LOGIN: "Connexion utilisateur",
        ActionType.USER_LOGOUT: "Déconnexion utilisateur",
        ActionType.ROLE_CREATE: "Nouveau rôle créé",
        ActionType.ROLE_UPDATE: "Rôle mis à jour",
        ActionType.ROLE_DELETE: "Rôle supprimé",
        ActionType.PERMISSION_CREATE: "Nouvelle permission créée",
        ActionType.PERMISSION_UPDATE: "Permission mise à jour",
        ActionType.PERMISSION_DELETE: "Permission supprimée",
        ActionType.PERMISSION_ASSIGN: "Permissions assignées au rôle",
        ActionType.PERMISSION_REVOKE: "Permissions révoquées du rôle",
        ActionType.SETTINGS_UPDATE: "Paramètres système mis à jour",
    }
    
    return action_descriptions.get(action, f"Action: {action}")


def extract_target_info(path: str) -> tuple[str | None, str | None]:
    """
    Extract target type and ID from the request path
    """
    parts = path.strip("/").split("/")
    
    # Look for resource type and ID pattern
    # Example: /api/v1/users/123 -> ("user", "123")
    for i, part in enumerate(parts):
        if part in ["users", "roles", "permissions", "settings"]:
            target_type = part.rstrip("s")  # Remove trailing 's'
            target_id = parts[i + 1] if i + 1 < len(parts) and parts[i + 1].isdigit() else None
            return target_type, target_id
    
    return None, None
