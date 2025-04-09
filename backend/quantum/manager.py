"""
Quantum computation manager to coordinate different quantum modules.
"""
from typing import Dict, Any, List, Optional
import time
import logging
import sys
import os

# Add the parent directory to path so we can import modules
sys.path.append(os.path.abspath(os.path.dirname(os.path.dirname(__file__))))

# Try to import the real qiskit adapter, fall back to mock adapter
try:
    from quantum.modules.qiskit_adapter import QiskitAdapter
    USING_MOCK = False
    logger = logging.getLogger(__name__)
    logger.info("Using real Qiskit adapter")
except ImportError:
    from quantum.modules.mock_adapter import MockQuantumAdapter
    USING_MOCK = True
    logger = logging.getLogger(__name__)
    logger.warning("Using mock adapter instead of real Qiskit adapter")

from quantum.modules.antimatter import AntimatterSimulator

# Set up logging
logger = logging.getLogger(__name__)


class QuantumModuleManager:
    """
    Manager for quantum computation modules.
    Coordinates different modules and provides a unified interface.
    """
    
    # Initialize the adapter
    if USING_MOCK:
        _adapter = MockQuantumAdapter()
    else:
        _adapter = QiskitAdapter
    
    @staticmethod
    def estimate_resources(system_id: str, configuration: Dict[str, Any]) -> Dict[str, Any]:
        """
        Estimate computational resources needed for an experiment.
        
        Args:
            system_id: ID of the quantum system
            configuration: Experiment configuration
            
        Returns:
            Dictionary with resource estimates
        """
        if USING_MOCK:
            # Get molecule data from mock adapter
            try:
                for system in QuantumModuleManager._adapter.SYSTEMS:
                    if system["id"].lower() == system_id.lower():
                        molecule_data = system
                        break
                else:
                    molecule_data = None
                
                if molecule_data:
                    # Use the mock adapter's resource estimation
                    return QuantumModuleManager._adapter.estimate_resources(
                        molecule_data, 
                        basis_set=configuration.get("basis_set", "sto-3g"),
                        experiment_type=configuration.get("experiment_type", "ground_state")
                    )
            except Exception as e:
                logger.error(f"Error in mock resource estimation: {str(e)}")
        
        # Fallback to generic resource estimation
        qubits = 2
        depth = 10
        runtime_estimate = "2-5 seconds"
        
        # Adjust based on system
        if system_id.lower() in ["h2o", "lih"]:
            qubits += 6
            depth += 30
            runtime_estimate = "10-30 seconds"
        elif system_id.lower() in ["h2"]:
            qubits += 2
            depth += 10
        elif system_id.lower() in ["h", "he", "li"]:
            qubits += 1
            
        # Adjust based on algorithm
        algorithm = configuration.get("algorithm", "").upper()
        if algorithm == "VQE":
            depth *= 1.5
        elif algorithm == "QAOA":
            depth *= 2
        elif algorithm == "QPE":
            qubits *= 2
            depth *= 3
            runtime_estimate = "30-60 seconds"
            
        # Adjust based on ansatz
        ansatz = configuration.get("ansatz", "").upper()
        if ansatz == "UCCSD":
            qubits += 2
            depth *= 2
        elif ansatz == "HWE":
            depth += 10
            
        # Return estimates
        return {
            "qubits": int(qubits),
            "depth": int(depth),
            "runtime": runtime_estimate
        }
    
    @staticmethod
    def run_experiment(
        system_id: str,
        basis_set: str,
        experiment_type: str,
        configuration: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Run a quantum experiment based on the given parameters.
        
        Args:
            system_id: ID of the quantum system
            basis_set: Basis set to use
            experiment_type: Type of experiment to run
            configuration: Experiment configuration
            
        Returns:
            Dictionary with experiment results
        """
        logger.info(f"Running experiment for system {system_id} with basis {basis_set}")
        start_time = time.time()
        
        try:
            # Check for antimatter systems
            if system_id.startswith("anti_"):
                # Run antimatter simulation
                if system_id == "anti_H":
                    result = AntimatterSimulator.simulate_antihydrogen(configuration)
                elif system_id == "anti_Ps":
                    result = AntimatterSimulator.simulate_positronium(configuration)
                else:
                    raise ValueError(f"Unsupported antimatter system: {system_id}")
            
            # For mock adapter, handle differently
            elif USING_MOCK:
                # Get molecule data from system_id
                for system in QuantumModuleManager._adapter.SYSTEMS:
                    if system["id"].lower() == system_id.lower():
                        molecule_data = system
                        break
                else:
                    raise ValueError(f"Unknown system ID: {system_id}")
                
                # Map experiment types
                experiment_map = {
                    "ground": "ground_state",
                    "excited": "excited_state",
                    "geometry": "geometry_optimization",
                    "vibrational": "vibrational_analysis",
                    "dipole": "dipole_moment"
                }
                mock_experiment_type = experiment_map.get(experiment_type, experiment_type)
                
                # Run with mock adapter
                result = QuantumModuleManager._adapter.run_experiment(
                    mock_experiment_type,
                    molecule_data,
                    basis_set,
                    **configuration
                )
                
                # Ensure data field exists
                if "data" not in result:
                    result["data"] = {}

            # For real Qiskit adapter    
            else:
                # Run regular quantum chemistry calculation with Qiskit
                if experiment_type == "ground":
                    result = QuantumModuleManager._adapter.calculate_ground_state(
                        system_id=system_id,
                        basis_set=basis_set,
                        configuration=configuration
                    )
                elif experiment_type == "excited":
                    # For now, just return ground state with a message
                    result = QuantumModuleManager._adapter.calculate_ground_state(
                        system_id=system_id,
                        basis_set=basis_set,
                        configuration=configuration
                    )
                    result["data"]["message"] = "Excited state calculation not yet implemented, showing ground state instead"
                else:
                    raise ValueError(f"Unsupported experiment type: {experiment_type}")
                    
            # Add system info to result
            result["system_id"] = system_id
            result["basis_set"] = basis_set
            result["experiment_type"] = experiment_type
            
            return result
            
        except Exception as e:
            logger.error(f"Error running experiment: {str(e)}")
            return {
                "error": str(e),
                "system_id": system_id,
                "basis_set": basis_set,
                "experiment_type": experiment_type,
                "runtime": time.time() - start_time
            } 