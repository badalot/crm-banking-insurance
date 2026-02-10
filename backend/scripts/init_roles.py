"""
Script pour initialiser les rôles et permissions par défaut dans la base de données
"""
from app.core.database import SessionLocal
from app.models.user import Role, Permission


def init_permissions():
    """Créer les permissions par défaut"""
    db = SessionLocal()
    
    permissions_data = [
        # Users permissions
        {"name": "users.create", "resource": "users", "action": "create", "description": "Créer des utilisateurs"},
        {"name": "users.read", "resource": "users", "action": "read", "description": "Lire les utilisateurs"},
        {"name": "users.update", "resource": "users", "action": "update", "description": "Modifier les utilisateurs"},
        {"name": "users.delete", "resource": "users", "action": "delete", "description": "Supprimer les utilisateurs"},
        
        # Clients permissions
        {"name": "clients.create", "resource": "clients", "action": "create", "description": "Créer des clients"},
        {"name": "clients.read", "resource": "clients", "action": "read", "description": "Lire les clients"},
        {"name": "clients.update", "resource": "clients", "action": "update", "description": "Modifier les clients"},
        {"name": "clients.delete", "resource": "clients", "action": "delete", "description": "Supprimer les clients"},
        
        # Reports permissions
        {"name": "reports.create", "resource": "reports", "action": "create", "description": "Créer des rapports"},
        {"name": "reports.read", "resource": "reports", "action": "read", "description": "Lire les rapports"},
        {"name": "reports.export", "resource": "reports", "action": "export", "description": "Exporter les rapports"},
        
        # System permissions
        {"name": "system.settings", "resource": "system", "action": "settings", "description": "Gérer les paramètres système"},
        {"name": "system.logs", "resource": "system", "action": "logs", "description": "Voir les logs système"},
    ]
    
    permissions = {}
    for perm_data in permissions_data:
        # Vérifier si la permission existe déjà
        existing_perm = db.query(Permission).filter(Permission.name == perm_data["name"]).first()
        if not existing_perm:
            perm = Permission(**perm_data)
            db.add(perm)
            db.commit()
            db.refresh(perm)
            permissions[perm_data["name"]] = perm
            print(f"✅ Permission créée: {perm_data['name']}")
        else:
            permissions[perm_data["name"]] = existing_perm
            print(f"⏭️  Permission existe déjà: {perm_data['name']}")
    
    db.close()
    return permissions


def init_roles():
    """Créer les rôles par défaut avec leurs permissions"""
    db = SessionLocal()
    
    # Récupérer toutes les permissions
    all_permissions = db.query(Permission).all()
    perms_dict = {p.name: p for p in all_permissions}
    
    roles_data = [
        {
            "name": "Super Admin",
            "description": "Accès complet à toutes les fonctionnalités",
            "permissions": list(perms_dict.keys())  # Toutes les permissions
        },
        {
            "name": "Admin",
            "description": "Gestion des utilisateurs et clients",
            "permissions": [
                "users.create", "users.read", "users.update", "users.delete",
                "clients.create", "clients.read", "clients.update", "clients.delete",
                "reports.read", "reports.export"
            ]
        },
        {
            "name": "Manager",
            "description": "Gestion de l'agence et des rapports",
            "permissions": [
                "users.read",
                "clients.create", "clients.read", "clients.update",
                "reports.create", "reports.read", "reports.export"
            ]
        },
        {
            "name": "Agent",
            "description": "Gestion des clients assignés",
            "permissions": [
                "clients.create", "clients.read", "clients.update",
                "reports.read"
            ]
        },
        {
            "name": "Viewer",
            "description": "Accès en lecture seule",
            "permissions": [
                "clients.read",
                "reports.read"
            ]
        }
    ]
    
    for role_data in roles_data:
        # Vérifier si le rôle existe déjà
        existing_role = db.query(Role).filter(Role.name == role_data["name"]).first()
        if not existing_role:
            role = Role(
                name=role_data["name"],
                description=role_data["description"]
            )
            # Ajouter les permissions
            for perm_name in role_data["permissions"]:
                if perm_name in perms_dict:
                    role.permissions.append(perms_dict[perm_name])
            
            db.add(role)
            db.commit()
            db.refresh(role)
            print(f"✅ Rôle créé: {role_data['name']} avec {len(role.permissions)} permissions")
        else:
            print(f"⏭️  Rôle existe déjà: {role_data['name']}")
    
    db.close()


def main():
    """Point d'entrée principal"""
    print("🚀 Initialisation des rôles et permissions...")
    print("\n1️⃣ Création des permissions...")
    init_permissions()
    print("\n2️⃣ Création des rôles...")
    init_roles()
    print("\n✨ Initialisation terminée!")


if __name__ == "__main__":
    main()
