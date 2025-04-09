"""
Main FastAPI application with hybrid real/mock quantum functionality.
"""
import logging
from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import time
import sys
import os

# Add the parent directory to the path so we can import modules
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Import backend modules
from config import API_V1_STR, PROJECT_NAME, BACKEND_CORS_ORIGINS, AVAILABLE_SYSTEMS, AVAILABLE_BASIS_SETS, AVAILABLE_EXPERIMENT_TYPES
from db.database import engine, get_db
from db.models import Base, Experiment, ExperimentResult
from schemas.systems import QuantumSystem, BasisSet, ExperimentType, QuantumSystemsList, BasisSetsList, ExperimentTypesList
from schemas.experiments import ExperimentCreate, ExperimentDB, ResourceEstimate, ExperimentStatus
from schemas.results import ExperimentResultDB, ExperimentResultDetails

# Check if using mock or real quantum implementation
try:
    from quantum.manager import QuantumModuleManager, USING_MOCK
    if USING_MOCK:
        logger.warning("Using MOCKED quantum calculations (no qiskit)")
    else:
        logger.info("Using REAL quantum calculations (with qiskit-nature)")
except ImportError as e:
    logger.error(f"Error importing quantum modules: {str(e)}")
    raise

# Create database tables
Base.metadata.create_all(bind=engine)

# Create FastAPI app
app = FastAPI(
    title=PROJECT_NAME,
    openapi_url=f"{API_V1_STR}/openapi.json",
    docs_url=f"{API_V1_STR}/docs",
)

# Set up CORS - allowing all origins during development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins in development
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint with basic information."""
    return {
        "name": PROJECT_NAME,
        "version": "0.1.0",
        "description": "API for quantum chemistry simulations",
        "using_mock": USING_MOCK
    }

# Health check
@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok", "using_mock": USING_MOCK}

# Systems endpoints
@app.get(f"{API_V1_STR}/systems", response_model=QuantumSystemsList)
async def get_quantum_systems():
    """Get all available quantum systems."""
    systems = [QuantumSystem(**system) for system in AVAILABLE_SYSTEMS]
    return {"systems": systems}

@app.get(f"{API_V1_STR}/systems/{{system_id}}", response_model=QuantumSystem)
async def get_quantum_system(system_id: str):
    """Get a specific quantum system by ID."""
    system = next((s for s in AVAILABLE_SYSTEMS if s["id"] == system_id), None)
    if not system:
        raise HTTPException(status_code=404, detail=f"System {system_id} not found")
    return system

@app.get(f"{API_V1_STR}/basis-sets", response_model=BasisSetsList)
async def get_basis_sets():
    """Get all available basis sets."""
    basis_sets = [BasisSet(**basis) for basis in AVAILABLE_BASIS_SETS]
    return {"basis_sets": basis_sets}

@app.get(f"{API_V1_STR}/experiment-types", response_model=ExperimentTypesList)
async def get_experiment_types():
    """Get all available experiment types."""
    experiment_types = [ExperimentType(**exp_type) for exp_type in AVAILABLE_EXPERIMENT_TYPES]
    return {"experiment_types": experiment_types}

# Experiments endpoints
@app.post(f"{API_V1_STR}/experiments", response_model=ExperimentDB)
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

@app.get(f"{API_V1_STR}/experiments", response_model=list[ExperimentDB])
async def get_experiments(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    """Get all experiments."""
    return db.query(Experiment).offset(skip).limit(limit).all()

@app.get(f"{API_V1_STR}/experiments/{{experiment_id}}", response_model=ExperimentDB)
async def get_experiment(
    experiment_id: int,
    db: Session = Depends(get_db)
):
    """Get a specific experiment by ID."""
    experiment = db.query(Experiment).filter(Experiment.id == experiment_id).first()
    if not experiment:
        raise HTTPException(status_code=404, detail=f"Experiment {experiment_id} not found")
    return experiment

@app.post(f"{API_V1_STR}/experiments/{{experiment_id}}/run", response_model=ExperimentResultDB)
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
    
    try:
        # Run the experiment using the quantum module manager
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
    except Exception as e:
        logger.error(f"Error running experiment: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post(f"{API_V1_STR}/estimate-resources", response_model=ResourceEstimate)
async def estimate_resources(
    system_id: str,
    configuration: dict
):
    """Estimate computational resources for an experiment."""
    estimates = QuantumModuleManager.estimate_resources(
        system_id=system_id,
        configuration=configuration
    )
    return ResourceEstimate(**estimates)

# Results endpoints
@app.get(f"{API_V1_STR}/results", response_model=list[ExperimentResultDB])
async def get_results(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    """Get all experiment results."""
    return db.query(ExperimentResult).offset(skip).limit(limit).all()

@app.get(f"{API_V1_STR}/results/{{result_id}}", response_model=ExperimentResultDB)
async def get_result(
    result_id: int,
    db: Session = Depends(get_db)
):
    """Get a specific result by ID."""
    result = db.query(ExperimentResult).filter(ExperimentResult.id == result_id).first()
    if not result:
        raise HTTPException(status_code=404, detail=f"Result {result_id} not found")
    return result

@app.get(f"{API_V1_STR}/experiments/{{experiment_id}}/results", response_model=list[ExperimentResultDB])
async def get_experiment_results(
    experiment_id: int,
    db: Session = Depends(get_db)
):
    """Get all results for a specific experiment."""
    experiment = db.query(Experiment).filter(Experiment.id == experiment_id).first()
    if not experiment:
        raise HTTPException(status_code=404, detail=f"Experiment {experiment_id} not found")
    
    return db.query(ExperimentResult).filter(ExperimentResult.experiment_id == experiment_id).all()

@app.get(f"{API_V1_STR}/results/{{result_id}}/details", response_model=ExperimentResultDetails)
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 