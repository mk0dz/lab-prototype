"""
API endpoints for experiments.
"""
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Dict, Any
import sys
import os

# Add the parent directory to path so we can import modules
sys.path.append(os.path.abspath(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))))
from db.database import get_db
from db.models import Experiment, ExperimentResult
from schemas.experiments import (
    ExperimentCreate, ExperimentDB, ResourceEstimate, ExperimentStatus
)
from schemas.results import ExperimentResultCreate, ExperimentResultDB
from quantum.manager import QuantumModuleManager

router = APIRouter()


@router.post("/experiments", response_model=ExperimentDB)
async def create_experiment(
    experiment: ExperimentCreate,
    db: Session = Depends(get_db)
):
    """Create a new experiment."""
    # Create DB record
    db_experiment = Experiment(
        name=experiment.name or f"Experiment {experiment.system_id}",
        system_id=experiment.system_id,
        basis_set=experiment.basis_set,
        experiment_type=experiment.experiment_type,
        configuration=experiment.configuration.dict()
    )
    
    # Add to database
    db.add(db_experiment)
    db.commit()
    db.refresh(db_experiment)
    
    return db_experiment


@router.get("/experiments", response_model=List[ExperimentDB])
async def get_experiments(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    """Get all experiments."""
    return db.query(Experiment).offset(skip).limit(limit).all()


@router.get("/experiments/{experiment_id}", response_model=ExperimentDB)
async def get_experiment(
    experiment_id: int,
    db: Session = Depends(get_db)
):
    """Get a specific experiment by ID."""
    experiment = db.query(Experiment).filter(Experiment.id == experiment_id).first()
    if not experiment:
        raise HTTPException(status_code=404, detail=f"Experiment {experiment_id} not found")
    return experiment


@router.post("/experiments/{experiment_id}/run", response_model=ExperimentResultDB)
async def run_experiment(
    experiment_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Run an experiment and store the results."""
    # Get experiment from DB
    experiment = db.query(Experiment).filter(Experiment.id == experiment_id).first()
    if not experiment:
        raise HTTPException(status_code=404, detail=f"Experiment {experiment_id} not found")
    
    # Run the experiment
    result = QuantumModuleManager.run_experiment(
        system_id=experiment.system_id,
        basis_set=experiment.basis_set,
        experiment_type=experiment.experiment_type,
        configuration=experiment.configuration
    )
    
    # Check for errors
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    
    # Store results in DB
    db_result = ExperimentResult(
        experiment_id=experiment.id,
        energy=result["energy"],
        reference_energy=result.get("reference_energy"),
        iterations=result["iterations"],
        runtime=result["runtime"],
        convergence=result.get("convergence"),
        data=result["data"]
    )
    
    db.add(db_result)
    db.commit()
    db.refresh(db_result)
    
    return db_result


@router.post("/estimate-resources", response_model=ResourceEstimate)
async def estimate_resources(
    system_id: str,
    configuration: Dict[str, Any]
):
    """Estimate computational resources for an experiment."""
    estimates = QuantumModuleManager.estimate_resources(
        system_id=system_id,
        configuration=configuration
    )
    return estimates 