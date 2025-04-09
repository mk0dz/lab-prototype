"""
Schemas related to quantum systems.
"""
from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field


class QuantumSystem(BaseModel):
    """Schema for available quantum systems."""
    id: str
    name: str
    description: Optional[str] = None


class BasisSet(BaseModel):
    """Schema for basis sets."""
    id: str
    name: str
    group: Optional[str] = None
    description: Optional[str] = None


class ExperimentType(BaseModel):
    """Schema for experiment types."""
    id: str
    name: str 
    description: Optional[str] = None


class QuantumSystemsList(BaseModel):
    """Schema for list of quantum systems."""
    systems: List[QuantumSystem]


class BasisSetsList(BaseModel):
    """Schema for list of basis sets."""
    basis_sets: List[BasisSet]


class ExperimentTypesList(BaseModel):
    """Schema for list of experiment types."""
    experiment_types: List[ExperimentType] 