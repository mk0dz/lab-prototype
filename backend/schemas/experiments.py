"""
Schemas related to experiments.
"""
from typing import Dict, List, Optional, Any
from datetime import datetime
from pydantic import BaseModel, Field


class ExperimentConfig(BaseModel):
    """Schema for experiment configuration."""
    ansatz: str
    mapper: str
    hamiltonian: str
    algorithm: str
    advanced_options: Optional[Dict[str, Any]] = None


class ExperimentBase(BaseModel):
    """Base schema for experiment."""
    name: Optional[str] = None
    system_id: str
    basis_set: str
    experiment_type: str
    configuration: ExperimentConfig


class ExperimentCreate(ExperimentBase):
    """Schema for creating an experiment."""
    pass


class ExperimentDB(ExperimentBase):
    """Schema for experiment from database."""
    id: int
    created_at: datetime
    
    class Config:
        """Pydantic config."""
        orm_mode = True


class ResourceEstimate(BaseModel):
    """Schema for resource estimation."""
    qubits: int
    depth: int
    runtime: str


class ExperimentStatus(BaseModel):
    """Schema for experiment status."""
    id: int
    status: str
    progress: Optional[float] = None
    message: Optional[str] = None 