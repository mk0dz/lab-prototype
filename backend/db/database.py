"""
Simple database interface for storing and retrieving quantum experiment data.
"""
import json
import logging
import os
import sqlite3
from datetime import datetime
from typing import Dict, Any, List, Optional, Tuple

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

logger = logging.getLogger(__name__)

# Database settings
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SQLITE_DB_PATH = os.path.join(BASE_DIR, "quantum_lab.db")
SQLALCHEMY_DATABASE_URL = f"sqlite:///{SQLITE_DB_PATH}"

# Create SQLAlchemy engine and session
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Legacy SQLite code - maintained for compatibility
# Database file path - store in data directory
DB_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
os.makedirs(DB_DIR, exist_ok=True)
DB_PATH = os.path.join(DB_DIR, "quantum_experiments.db")

def dict_factory(cursor, row):
    """Convert database row to dictionary."""
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

def init_db():
    """Initialize the database."""
    logger.info(f"Initializing database at {DB_PATH}")
    
    with sqlite3.connect(DB_PATH) as conn:
        conn.row_factory = dict_factory
        cursor = conn.cursor()
        
        # Create experiments table
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS experiments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            experiment_id TEXT UNIQUE NOT NULL,
            system_id TEXT NOT NULL,
            basis_set TEXT NOT NULL,
            experiment_type TEXT NOT NULL,
            configuration TEXT NOT NULL,
            status TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )
        ''')
        
        # Create results table
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            result_id TEXT UNIQUE NOT NULL,
            experiment_id TEXT NOT NULL,
            energy REAL,
            reference_energy REAL,
            iterations INTEGER,
            runtime REAL,
            error TEXT,
            data TEXT NOT NULL,
            created_at TEXT NOT NULL,
            FOREIGN KEY (experiment_id) REFERENCES experiments (experiment_id)
        )
        ''')
        
        conn.commit()
        logger.info("Database initialized successfully")

def create_experiment(
    experiment_id: str,
    system_id: str,
    basis_set: str,
    experiment_type: str,
    configuration: Dict[str, Any]
) -> Dict[str, Any]:
    """Create a new experiment record."""
    logger.info(f"Creating experiment: {experiment_id}")
    
    now = datetime.utcnow().isoformat()
    
    with sqlite3.connect(DB_PATH) as conn:
        conn.row_factory = dict_factory
        cursor = conn.cursor()
        
        cursor.execute('''
        INSERT INTO experiments 
        (experiment_id, system_id, basis_set, experiment_type, configuration, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            experiment_id,
            system_id,
            basis_set,
            experiment_type,
            json.dumps(configuration),
            "pending",
            now,
            now
        ))
        
        conn.commit()
        
        # Return the created experiment
        cursor.execute('SELECT * FROM experiments WHERE experiment_id = ?', (experiment_id,))
        experiment = cursor.fetchone()
        
        if experiment:
            experiment['configuration'] = json.loads(experiment['configuration'])
            
        return experiment

def get_experiment(experiment_id: str) -> Optional[Dict[str, Any]]:
    """Get experiment by ID."""
    logger.info(f"Getting experiment: {experiment_id}")
    
    with sqlite3.connect(DB_PATH) as conn:
        conn.row_factory = dict_factory
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM experiments WHERE experiment_id = ?', (experiment_id,))
        experiment = cursor.fetchone()
        
        if experiment:
            experiment['configuration'] = json.loads(experiment['configuration'])
            
        return experiment

def list_experiments(
    system_id: Optional[str] = None,
    experiment_type: Optional[str] = None,
    status: Optional[str] = None,
    limit: int = 100,
    offset: int = 0
) -> List[Dict[str, Any]]:
    """List experiments with optional filtering."""
    logger.info(f"Listing experiments with filters: system={system_id}, type={experiment_type}, status={status}")
    
    query = 'SELECT * FROM experiments WHERE 1=1'
    params = []
    
    if system_id:
        query += ' AND system_id = ?'
        params.append(system_id)
        
    if experiment_type:
        query += ' AND experiment_type = ?'
        params.append(experiment_type)
        
    if status:
        query += ' AND status = ?'
        params.append(status)
        
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
    params.extend([limit, offset])
    
    with sqlite3.connect(DB_PATH) as conn:
        conn.row_factory = dict_factory
        cursor = conn.cursor()
        
        cursor.execute(query, params)
        experiments = cursor.fetchall()
        
        # Parse JSON configuration
        for exp in experiments:
            exp['configuration'] = json.loads(exp['configuration'])
            
        return experiments

def update_experiment_status(experiment_id: str, status: str) -> Dict[str, Any]:
    """Update experiment status."""
    logger.info(f"Updating experiment {experiment_id} status to {status}")
    
    now = datetime.utcnow().isoformat()
    
    with sqlite3.connect(DB_PATH) as conn:
        conn.row_factory = dict_factory
        cursor = conn.cursor()
        
        cursor.execute('''
        UPDATE experiments 
        SET status = ?, updated_at = ?
        WHERE experiment_id = ?
        ''', (status, now, experiment_id))
        
        conn.commit()
        
        # Return updated experiment
        cursor.execute('SELECT * FROM experiments WHERE experiment_id = ?', (experiment_id,))
        experiment = cursor.fetchone()
        
        if experiment:
            experiment['configuration'] = json.loads(experiment['configuration'])
            
        return experiment

def store_result(
    result_id: str,
    experiment_id: str,
    energy: Optional[float],
    reference_energy: Optional[float],
    iterations: Optional[int],
    runtime: Optional[float],
    error: Optional[str],
    data: Dict[str, Any]
) -> Dict[str, Any]:
    """Store calculation result."""
    logger.info(f"Storing result {result_id} for experiment {experiment_id}")
    
    now = datetime.utcnow().isoformat()
    
    with sqlite3.connect(DB_PATH) as conn:
        conn.row_factory = dict_factory
        cursor = conn.cursor()
        
        cursor.execute('''
        INSERT INTO results
        (result_id, experiment_id, energy, reference_energy, iterations, runtime, error, data, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            result_id,
            experiment_id,
            energy,
            reference_energy,
            iterations,
            runtime,
            error,
            json.dumps(data),
            now
        ))
        
        # Update experiment status
        cursor.execute('''
        UPDATE experiments
        SET status = ?, updated_at = ?
        WHERE experiment_id = ?
        ''', ("completed" if not error else "failed", now, experiment_id))
        
        conn.commit()
        
        # Return the stored result
        cursor.execute('SELECT * FROM results WHERE result_id = ?', (result_id,))
        result = cursor.fetchone()
        
        if result:
            result['data'] = json.loads(result['data'])
            
        return result

def get_result(result_id: str) -> Optional[Dict[str, Any]]:
    """Get result by ID."""
    logger.info(f"Getting result: {result_id}")
    
    with sqlite3.connect(DB_PATH) as conn:
        conn.row_factory = dict_factory
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM results WHERE result_id = ?', (result_id,))
        result = cursor.fetchone()
        
        if result:
            result['data'] = json.loads(result['data'])
            
        return result

def get_results_for_experiment(experiment_id: str) -> List[Dict[str, Any]]:
    """Get all results for an experiment."""
    logger.info(f"Getting results for experiment: {experiment_id}")
    
    with sqlite3.connect(DB_PATH) as conn:
        conn.row_factory = dict_factory
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM results WHERE experiment_id = ? ORDER BY created_at DESC', (experiment_id,))
        results = cursor.fetchall()
        
        # Parse JSON data
        for res in results:
            res['data'] = json.loads(res['data'])
            
        return results

def delete_experiment(experiment_id: str) -> bool:
    """Delete an experiment and its results."""
    logger.info(f"Deleting experiment: {experiment_id}")
    
    with sqlite3.connect(DB_PATH) as conn:
        conn.row_factory = dict_factory
        cursor = conn.cursor()
        
        # Delete associated results first (due to foreign key constraint)
        cursor.execute('DELETE FROM results WHERE experiment_id = ?', (experiment_id,))
        
        # Then delete the experiment
        cursor.execute('DELETE FROM experiments WHERE experiment_id = ?', (experiment_id,))
        
        rows_affected = cursor.rowcount
        conn.commit()
        
        return rows_affected > 0

def get_available_systems() -> List[Dict[str, Any]]:
    """Get list of available quantum systems from the database."""
    # For this demo, we'll return static systems
    return [
        {"id": "h2", "name": "Hydrogen (H₂)", "description": "Hydrogen molecule"},
        {"id": "h2o", "name": "Water (H₂O)", "description": "Water molecule"},
        {"id": "nh3", "name": "Ammonia (NH₃)", "description": "Ammonia molecule"},
        {"id": "ch4", "name": "Methane (CH₄)", "description": "Methane molecule"}
    ]

def get_available_basis_sets() -> List[Dict[str, str]]:
    """Get list of available basis sets."""
    return [
        {"id": "sto-3g", "name": "STO-3G", "description": "Minimal basis set"},
        {"id": "3-21g", "name": "3-21G", "description": "Split-valence basis set"},
        {"id": "6-31g", "name": "6-31G", "description": "Split-valence basis set"},
        {"id": "cc-pvdz", "name": "cc-pVDZ", "description": "Correlation-consistent basis set (double zeta)"},
        {"id": "cc-pvtz", "name": "cc-pVTZ", "description": "Correlation-consistent basis set (triple zeta)"}
    ]

def get_available_experiment_types() -> List[Dict[str, str]]:
    """Get list of available experiment types."""
    return [
        {"id": "ground_state", "name": "Ground State", "description": "Calculate molecular ground state energy"},
        {"id": "excited_state", "name": "Excited State", "description": "Calculate molecular excited states"},
        {"id": "geometry_optimization", "name": "Geometry Optimization", "description": "Optimize molecular geometry"}
    ] 