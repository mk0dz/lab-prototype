"""
API endpoints for experiment results.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import sys
import os

# Add the parent directory to path so we can import modules
sys.path.append(os.path.abspath(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))))
from db.database import get_db
from db.models import Experiment, ExperimentResult
from schemas.results import ExperimentResultDB, ExperimentResultDetails
from config import AVAILABLE_SYSTEMS

router = APIRouter()


@router.get("/results", response_model=List[ExperimentResultDB])
async def get_results(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    """Get all experiment results."""
    return db.query(ExperimentResult).offset(skip).limit(limit).all()


@router.get("/results/{result_id}", response_model=ExperimentResultDB)
async def get_result(
    result_id: int,
    db: Session = Depends(get_db)
):
    """Get a specific result by ID."""
    result = db.query(ExperimentResult).filter(ExperimentResult.id == result_id).first()
    if not result:
        raise HTTPException(status_code=404, detail=f"Result {result_id} not found")
    return result


@router.get("/experiments/{experiment_id}/results", response_model=List[ExperimentResultDB])
async def get_experiment_results(
    experiment_id: int,
    db: Session = Depends(get_db)
):
    """Get all results for a specific experiment."""
    experiment = db.query(Experiment).filter(Experiment.id == experiment_id).first()
    if not experiment:
        raise HTTPException(status_code=404, detail=f"Experiment {experiment_id} not found")
    
    return db.query(ExperimentResult).filter(ExperimentResult.experiment_id == experiment_id).all()


@router.get("/results/{result_id}/details", response_model=ExperimentResultDetails)
async def get_result_details(
    result_id: int,
    db: Session = Depends(get_db)
):
    """Get detailed information about a result."""
    result = db.query(ExperimentResult).filter(ExperimentResult.id == result_id).first()
    if not result:
        raise HTTPException(status_code=404, detail=f"Result {result_id} not found")
    
    experiment = db.query(Experiment).filter(Experiment.id == result.experiment_id).first()
    if not experiment:
        raise HTTPException(status_code=404, detail=f"Experiment for result {result_id} not found")
    
    # Find system name from config or use ID as fallback
    system_name = next((s["name"] for s in AVAILABLE_SYSTEMS if s["id"] == experiment.system_id), experiment.system_id)
    
    # Create detailed result
    detailed_result = {
        "id": result.id,
        "experiment_id": result.experiment_id,
        "energy": result.energy,
        "reference_energy": result.reference_energy,
        "iterations": result.iterations,
        "runtime": result.runtime,
        "convergence": result.convergence,
        "created_at": result.created_at,
        "system_name": system_name,
        "configuration": experiment.configuration
    }
    
    return detailed_result 