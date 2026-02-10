# Schéma de Base de Données - Module Auth & Users

## Tables Principales

### 1. users
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);
```

### 2. roles
```sql
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. permissions
```sql
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    resource VARCHAR(50) NOT NULL,  -- clients, users, reports, etc.
    action VARCHAR(50) NOT NULL,     -- create, read, update, delete
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. user_roles (Many-to-Many)
```sql
CREATE TABLE user_roles (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, role_id)
);
```

### 5. role_permissions (Many-to-Many)
```sql
CREATE TABLE role_permissions (
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);
```

## Rôles par Défaut

### Super Admin
- Accès complet au système
- Gestion des utilisateurs et rôles
- Configuration système

### Admin
- Gestion des clients
- Gestion des utilisateurs (limité)
- Tous les rapports

### Manager
- Gestion des clients de son agence
- Rapports de son agence
- Lecture seule sur les autres agences

### Agent
- Gestion des clients assignés
- Création de dossiers clients
- Pas d'accès aux rapports avancés

### Viewer
- Lecture seule
- Consultation des clients
- Pas de modifications

## Permissions Principales

### Users
- users.create
- users.read
- users.update
- users.delete
- users.manage_roles

### Clients
- clients.create
- clients.read
- clients.update
- clients.delete
- clients.export

### Reports
- reports.view
- reports.create
- reports.export

### System
- system.settings
- system.audit_logs
- system.backup

## Index pour Performance

```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_is_active ON users(is_active);
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role_id ON user_roles(role_id);
```
