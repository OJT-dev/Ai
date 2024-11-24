@echo off
start cmd /k "set PORT=3000 && npm run dev"
start cmd /k "set PYTHONPATH=%PYTHONPATH%;%CD% && set PORT=8000 && python -m uvicorn agency:app --host 0.0.0.0 --port 8000 --reload" 