#!/bin/bash
# Railway start script

# Install dependencies
pip install -r requirements.txt

# Start the application
uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
