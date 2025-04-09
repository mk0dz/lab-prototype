"""
Configuration settings for the backend.
"""
import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file if present
load_dotenv()

# Base directory
BASE_DIR = Path(__file__).resolve().parent

# API Settings
API_V1_STR = "/api/v1"
PROJECT_NAME = "Quantum Lab API"

# Database settings - using SQLite for simplicity
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR}/quantum_lab.db")

# CORS settings
BACKEND_CORS_ORIGINS = [
    "http://localhost:3000",  # Default Next.js port
    "http://localhost:8000",  # Backend URL
    "http://127.0.0.1:3000",
    "http://127.0.0.1:8000",
]

# Quantum settings
QISKIT_RUNTIME_TOKEN = os.getenv("QISKIT_RUNTIME_TOKEN", "")

# Default quantum systems available - these match the MockQuantumAdapter
AVAILABLE_SYSTEMS = [
    {"id": "h2o", "name": "Water", "description": "Water molecule (H2O)"},
    {"id": "ch4", "name": "Methane", "description": "Methane molecule (CH4)"},
    {"id": "nh3", "name": "Ammonia", "description": "Ammonia molecule (NH3)"},
    {"id": "co2", "name": "Carbon Dioxide", "description": "Carbon dioxide molecule (CO2)"}
]

# Default basis sets
AVAILABLE_BASIS_SETS = [
    {"id": "sto-3g", "name": "STO-3G", "description": "Minimal basis set, fast but less accurate"},
    {"id": "3-21g", "name": "3-21G", "description": "Split valence basis set"},
    {"id": "6-31g", "name": "6-31G", "description": "Split valence basis set"},
    {"id": "cc-pvdz", "name": "cc-pVDZ", "description": "Correlation consistent polarized valence double zeta basis set"},
    {"id": "cc-pvtz", "name": "cc-pVTZ", "description": "Correlation consistent polarized valence triple zeta basis set"}
]

# Experiment types
AVAILABLE_EXPERIMENT_TYPES = [
    {"id": "ground", "name": "Ground State", "description": "Calculate ground state energy"},
    {"id": "excited", "name": "Excited State", "description": "Calculate excited state properties"},
    {"id": "geometry", "name": "Geometry Optimization", "description": "Optimize molecular geometry"},
    {"id": "vibrational", "name": "Vibrational Analysis", "description": "Calculate vibrational frequencies"},
    {"id": "dipole", "name": "Dipole Moment", "description": "Calculate molecular dipole moment"}
] 