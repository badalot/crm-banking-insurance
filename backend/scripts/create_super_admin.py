"""
Script pour créer le Super Admin par défaut
Email: software@hcexecutive.net
Password: SuperAdmin2024!
"""
from app.core.database import SessionLocal
from app.models.user import User, Role
from app.core.security import get_password_hash


def create_super_admin():
    """Créer le Super Admin par défaut"""
    db = SessionLocal()
    
    # Vérifier si le Super Admin existe déjà
    existing_user = db.query(User).filter(User.email == "software@hcexecutive.net").first()
    if existing_user:
        print("⚠️  Super Admin existe déjà: software@hcexecutive.net")
        db.close()
        return
    
    # Récupérer le rôle Super Admin
    super_admin_role = db.query(Role).filter(Role.name == "Super Admin").first()
    if not super_admin_role:
        print("❌ Le rôle 'Super Admin' n'existe pas. Exécutez d'abord init_roles.py")
        db.close()
        return
    
    # Créer le Super Admin
    super_admin = User(
        email="software@hcexecutive.net",
        username="superadmin",
        hashed_password=get_password_hash("SuperAdmin2024!"),
        first_name="Super",
        last_name="Admin",
        phone="+221000000000",
        is_active=True,
        is_verified=True
    )
    
    db.add(super_admin)
    db.commit()
    db.refresh(super_admin)
    
    # Assigner le rôle Super Admin
    super_admin.roles.append(super_admin_role)
    db.commit()
    db.refresh(super_admin)
    
    print("✅ Super Admin créé avec succès!")
    print(f"   Email: software@hcexecutive.net")
    print(f"   Password: SuperAdmin2024!")
    print(f"   ⚠️  IMPORTANT: Changez ce mot de passe après la première connexion!")
    
    db.close()


def main():
    """Point d'entrée principal"""
    print("🚀 Création du Super Admin par défaut...")
    create_super_admin()
    print("✨ Terminé!")


if __name__ == "__main__":
    main()
