"""
SQLAlchemy models for database tables.
"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
import sys
import os

# Add the parent directory to path so we can import from db
sys.path.append(os.path.abspath(os.path.dirname(os.path.dirname(__file__))))
from db.database import Base


class Experiment(Base):
    """Model for quantum experiments."""
    __tablename__ = "experiments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    system_id = Column(String, index=True)
    basis_set = Column(String)
    experiment_type = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    configuration = Column(JSON)  # Store experiment configurations as JSON
    
    # Relationship to results
    results = relationship("ExperimentResult", back_populates="experiment", cascade="all, delete-orphan")


class ExperimentResult(Base):
    """Model for experiment results."""
    __tablename__ = "experiment_results"

    id = Column(Integer, primary_key=True, index=True)
    experiment_id = Column(Integer, ForeignKey("experiments.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    energy = Column(Float)  # Ground state energy result
    reference_energy = Column(Float, nullable=True)  # Reference value if available
    iterations = Column(Integer)  # Number of iterations performed
    runtime = Column(Float)  # Runtime in seconds
    convergence = Column(Float, nullable=True)  # Convergence metric
    data = Column(JSON)  # Any additional data as JSON
    
    # Relationship to experiment
    experiment = relationship("Experiment", back_populates="results") 