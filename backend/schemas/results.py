"""
Schemas related to experiment results.
"""
from typing import Dict, List, Optional, Any
from datetime import datetime
from pydantic import BaseModel, Field


class ExperimentResultBase(BaseModel):
    """Base schema for experiment results."""
    energy: float
    reference_energy: Optional[float] = None
    iterations: int
    runtime: float
    convergence: Optional[float] = None
    data: Optional[Dict[str, Any]] = None


class ExperimentResultCreate(ExperimentResultBase):
    """Schema for creating an experiment result."""
    experiment_id: int


class ExperimentResultDB(ExperimentResultBase):
    """Schema for experiment result from database."""
    id: int
    experiment_id: int
    created_at: datetime
    
    class Config:
        """Pydantic config."""
        orm_mode = True


class ExperimentResultDetails(BaseModel):
    """Schema for detailed experiment result."""
    id: int
    experiment_id: int
    energy: float
    reference_energy: Optional[float] = None
    iterations: int
    runtime: float
    convergence: Optional[float] = None
    created_at: datetime
    system_name: str
    configuration: Dict[str, Any]
    
    class Config:
        """Pydantic config."""
        orm_mode = True 