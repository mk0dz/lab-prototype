"""
API endpoints for quantum systems.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import sys
import os

# Add the parent directory to path so we can import modules
sys.path.append(os.path.abspath(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))))
from db.database import get_db
from schemas.systems import (
    QuantumSystem, BasisSet, ExperimentType,
    QuantumSystemsList, BasisSetsList, ExperimentTypesList
)
from config import AVAILABLE_SYSTEMS, AVAILABLE_BASIS_SETS, AVAILABLE_EXPERIMENT_TYPES

router = APIRouter()


@router.get("/systems", response_model=QuantumSystemsList)
async def get_quantum_systems():
    """Get all available quantum systems."""
    systems = [QuantumSystem(**system) for system in AVAILABLE_SYSTEMS]
    return {"systems": systems}


@router.get("/systems/{system_id}", response_model=QuantumSystem)
async def get_quantum_system(system_id: str):
    """Get a specific quantum system by ID."""
    system = next((s for s in AVAILABLE_SYSTEMS if s["id"] == system_id), None)
    if not system:
        raise HTTPException(status_code=404, detail=f"System {system_id} not found")
    return system


@router.get("/basis-sets", response_model=BasisSetsList)
async def get_basis_sets():
    """Get all available basis sets."""
    basis_sets = [BasisSet(**basis) for basis in AVAILABLE_BASIS_SETS]
    return {"basis_sets": basis_sets}


@router.get("/experiment-types", response_model=ExperimentTypesList)
async def get_experiment_types():
    """Get all available experiment types."""
    experiment_types = [ExperimentType(**exp_type) for exp_type in AVAILABLE_EXPERIMENT_TYPES]
    return {"experiment_types": experiment_types} 