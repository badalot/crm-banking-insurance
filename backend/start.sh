#!/bin/bash
# Railway start script

# Install dependencies
pip install -r requirements.txt

# Run database migrations
echo "Running database migrations..."
alembic upgrade head

# Initialize roles and permissions (only if tables are empty)
echo "Initializing roles and permissions..."
python -m scripts.init_roles || echo "Roles already initialized"

# Create Super Admin (only if doesn't exist)
echo "Creating Super Admin..."
python -m scripts.create_super_admin || echo "Super Admin already exists"

# Start the application
echo "Starting application..."
uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
