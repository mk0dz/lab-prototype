"""
Qiskit-Nature adapter for quantum computations.
"""
import time
import numpy as np
from typing import Dict, Any, Tuple, Optional, List
import logging

# Set up logging
logger = logging.getLogger(__name__)

# Import qiskit modules (Qiskit 2.0 compatibility)
try:
    from qiskit_aer import Aer
    from qiskit.primitives import Estimator
    from qiskit.circuit.library import TwoLocal
    from qiskit.algorithms.minimum_eigensolvers import VQE, NumPyMinimumEigensolver
    from qiskit.algorithms.optimizers import COBYLA, SPSA, L_BFGS_B
    
    # Import qiskit-nature modules
    from qiskit_nature.second_q.drivers import PySCFDriver
    from qiskit_nature.second_q.mappers import JordanWignerMapper, ParityMapper, BravyiKitaevMapper
    from qiskit_nature.second_q.formats.molecule_info import MoleculeInfo
    from qiskit_nature.second_q.transformers import FreezeCoreTransformer
    from qiskit_nature.second_q.problems import ElectronicStructureProblem
except ImportError as e:
    logger.error(f"Error importing qiskit modules: {str(e)}")
    raise


class QiskitAdapter:
    """Adapter for Qiskit-Nature quantum chemistry calculations."""

    @staticmethod
    def get_molecule(system_id: str) -> MoleculeInfo:
        """Get a molecule object based on system ID."""
        molecules = {
            "H2": MoleculeInfo(
                symbols=["H", "H"],
                coords=[(0.0, 0.0, 0.0), (0.0, 0.0, 0.735)],
                multiplicity=1,
                charge=0
            ),
            "LiH": MoleculeInfo(
                symbols=["Li", "H"],
                coords=[(0.0, 0.0, 0.0), (0.0, 0.0, 1.5)],
                multiplicity=1,
                charge=0
            ),
            "H2O": MoleculeInfo(
                symbols=["O", "H", "H"],
                coords=[(0.0, 0.0, 0.0), (0.757, 0.586, 0.0), (-0.757, 0.586, 0.0)],
                multiplicity=1,
                charge=0
            ),
            "H": MoleculeInfo(
                symbols=["H"],
                coords=[(0.0, 0.0, 0.0)],
                multiplicity=2,
                charge=0
            ),
            "He": MoleculeInfo(
                symbols=["He"],
                coords=[(0.0, 0.0, 0.0)],
                multiplicity=1,
                charge=0
            ),
            "Li": MoleculeInfo(
                symbols=["Li"],
                coords=[(0.0, 0.0, 0.0)],
                multiplicity=2,
                charge=0
            ),
        }
        
        if system_id not in molecules:
            raise ValueError(f"Unknown system: {system_id}")
            
        return molecules[system_id]

    @staticmethod
    def get_mapper(mapper_id: str):
        """Get a qubit mapping based on mapper ID."""
        mappers = {
            "JW": JordanWignerMapper(),
            "Parity": ParityMapper(),
            "BK": BravyiKitaevMapper(),
        }
        
        if mapper_id not in mappers:
            raise ValueError(f"Unknown mapper: {mapper_id}")
            
        return mappers[mapper_id]

    @staticmethod
    def get_optimizer(optimizer_id: str, **kwargs):
        """Get optimizer based on optimizer ID."""
        optimizers = {
            "COBYLA": COBYLA(maxiter=kwargs.get("maxiter", 1000)),
            "L_BFGS_B": L_BFGS_B(maxfun=kwargs.get("maxiter", 1000)),
            "SPSA": SPSA(maxiter=kwargs.get("maxiter", 100)),
        }
        
        if optimizer_id not in optimizers:
            raise ValueError(f"Unknown optimizer: {optimizer_id}")
            
        return optimizers[optimizer_id]

    @staticmethod
    def calculate_ground_state(
        system_id: str,
        basis_set: str,
        configuration: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Calculate the ground state energy using Qiskit-Nature.
        
        Args:
            system_id: ID of the quantum system
            basis_set: Basis set to use
            configuration: Experiment configuration
            
        Returns:
            Dictionary with calculation results
        """
        start_time = time.time()
        
        try:
            # Get molecule
            molecule = QiskitAdapter.get_molecule(system_id)
            
            # Create driver
            driver = PySCFDriver(
                molecule=molecule,
                basis=basis_set
            )
            
            # Create electronic structure problem
            problem = ElectronicStructureProblem(driver)
            
            # Apply freeze core transformation if molecules are larger than H or H2
            if system_id not in ["H", "H2"]:
                problem.transformers = [FreezeCoreTransformer()]
            
            # Get mapper
            mapper = QiskitAdapter.get_mapper(configuration["mapper"])
            
            # Create second quantized operators
            hamiltonian = problem.hamiltonian.second_q_op()
            
            # Convert to qubit operator
            qubit_op = mapper.map(hamiltonian)
            num_qubits = qubit_op.num_qubits
            
            # Get the reference (exact) energy using NumPy
            numpy_solver = NumPyMinimumEigensolver()
            reference_calc = numpy_solver.compute_minimum_eigenvalue(qubit_op)
            reference_energy = reference_calc.eigenvalue.real
            
            # For VQE calculations
            if configuration["algorithm"] == "VQE":
                # Set up the ansatz circuit
                if configuration["ansatz"] == "TwoLocal":
                    ansatz = TwoLocal(num_qubits, "ry", "cz", reps=2, entanglement="full")
                else:
                    # Default to TwoLocal for now
                    ansatz = TwoLocal(num_qubits, "ry", "cz", reps=2, entanglement="full")
                
                # Create the optimizer
                optimizer = QiskitAdapter.get_optimizer("COBYLA", maxiter=100)
                
                # Create the VQE instance
                estimator = Estimator()
                vqe = VQE(estimator, ansatz, optimizer)
                
                # Run VQE
                vqe_result = vqe.compute_minimum_eigenvalue(qubit_op)
                
                # Extract results
                energy = vqe_result.eigenvalue.real
                iterations = len(vqe_result.optimizer_evals) if hasattr(vqe_result, 'optimizer_evals') else 1
                convergence = abs(energy - reference_energy)
                
                # Create result data
                data = {
                    "optimizer_history": [float(x) for x in vqe_result.optimizer_evals] if hasattr(vqe_result, 'optimizer_evals') else [],
                    "optimal_parameters": {k: float(v) for k, v in vqe_result.optimal_parameters.items()} if hasattr(vqe_result, 'optimal_parameters') else {},
                    "optimal_circuit": ansatz.draw(output="text"),
                }
            else:
                # For exact calculation, we'll use the reference calculation
                energy = reference_energy
                iterations = 1
                convergence = 0.0
                data = {"message": "Exact calculation using NumPy eigensolver"}
            
            # Calculate runtime
            runtime = time.time() - start_time
            
            # Return results
            return {
                "energy": float(energy),
                "reference_energy": float(reference_energy),
                "iterations": iterations,
                "runtime": runtime,
                "convergence": float(convergence),
                "data": data
            }
        except Exception as e:
            # Log the error and return an error result
            import traceback
            error_details = traceback.format_exc()
            return {
                "error": f"Error in quantum calculation: {str(e)}",
                "error_details": error_details,
                "runtime": time.time() - start_time
            } 