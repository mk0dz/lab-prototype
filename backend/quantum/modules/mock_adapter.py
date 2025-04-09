"""
Mock adapter for quantum chemistry calculations.
This adapter simulates running quantum chemistry calculations without
actually using real quantum computing resources.
"""
import json
import logging
import random
import time
from datetime import datetime
from typing import Dict, Any, List, Optional

logger = logging.getLogger(__name__)

class MockQuantumAdapter:
    """Mock adapter for quantum chemistry calculations."""
    
    # Mock molecular systems data
    SYSTEMS = [
        {
            "id": "h2o",
            "name": "Water",
            "description": "Water molecule (H2O)",
            "atoms": [
                {"symbol": "O", "x": 0.0, "y": 0.0, "z": 0.0},
                {"symbol": "H", "x": 0.0, "y": 0.757, "z": 0.587},
                {"symbol": "H", "x": 0.0, "y": -0.757, "z": 0.587}
            ],
            "charge": 0,
            "multiplicity": 1
        },
        {
            "id": "ch4",
            "name": "Methane",
            "description": "Methane molecule (CH4)",
            "atoms": [
                {"symbol": "C", "x": 0.0, "y": 0.0, "z": 0.0},
                {"symbol": "H", "x": 0.626, "y": 0.626, "z": 0.626},
                {"symbol": "H", "x": -0.626, "y": -0.626, "z": 0.626},
                {"symbol": "H", "x": -0.626, "y": 0.626, "z": -0.626},
                {"symbol": "H", "x": 0.626, "y": -0.626, "z": -0.626}
            ],
            "charge": 0,
            "multiplicity": 1
        },
        {
            "id": "nh3",
            "name": "Ammonia",
            "description": "Ammonia molecule (NH3)",
            "atoms": [
                {"symbol": "N", "x": 0.0, "y": 0.0, "z": 0.0},
                {"symbol": "H", "x": 0.0, "y": -0.934, "z": -0.374},
                {"symbol": "H", "x": 0.809, "y": 0.467, "z": -0.374},
                {"symbol": "H", "x": -0.809, "y": 0.467, "z": -0.374}
            ],
            "charge": 0,
            "multiplicity": 1
        },
        {
            "id": "co2",
            "name": "Carbon Dioxide",
            "description": "Carbon dioxide molecule (CO2)",
            "atoms": [
                {"symbol": "C", "x": 0.0, "y": 0.0, "z": 0.0},
                {"symbol": "O", "x": 0.0, "y": 0.0, "z": 1.16},
                {"symbol": "O", "x": 0.0, "y": 0.0, "z": -1.16}
            ],
            "charge": 0,
            "multiplicity": 1
        }
    ]
    
    # Mock basis sets
    BASIS_SETS = [
        {"id": "sto-3g", "name": "STO-3G", "description": "Minimal basis set"},
        {"id": "3-21g", "name": "3-21G", "description": "Split valence basis set"},
        {"id": "6-31g", "name": "6-31G", "description": "Split valence basis set"},
        {"id": "cc-pvdz", "name": "cc-pVDZ", "description": "Correlation consistent polarized valence double zeta basis set"},
        {"id": "cc-pvtz", "name": "cc-pVTZ", "description": "Correlation consistent polarized valence triple zeta basis set"}
    ]
    
    # Mock experiment types
    EXPERIMENT_TYPES = [
        {"id": "ground_state", "name": "Ground State", "description": "Calculate ground state energy"},
        {"id": "excited_state", "name": "Excited State", "description": "Calculate excited state properties"},
        {"id": "geometry_optimization", "name": "Geometry Optimization", "description": "Optimize molecular geometry"},
        {"id": "vibrational_analysis", "name": "Vibrational Analysis", "description": "Calculate vibrational frequencies"},
        {"id": "dipole_moment", "name": "Dipole Moment", "description": "Calculate molecular dipole moment"}
    ]

    def __init__(self):
        """Initialize the mock adapter."""
        logger.info("Initializing MockQuantumAdapter")
        
        # Mock reference data for energy values (in hartree)
        self.reference_energies = {
            "h2o": {
                "sto-3g": -74.963,
                "3-21g": -75.585,
                "6-31g": -76.010,
                "cc-pvdz": -76.241,
                "cc-pvtz": -76.332
            },
            "ch4": {
                "sto-3g": -39.726,
                "3-21g": -40.195,
                "6-31g": -40.462,
                "cc-pvdz": -40.513,
                "cc-pvtz": -40.535
            },
            "nh3": {
                "sto-3g": -55.454,
                "3-21g": -55.987,
                "6-31g": -56.215,
                "cc-pvdz": -56.298,
                "cc-pvtz": -56.395
            },
            "co2": {
                "sto-3g": -185.253,
                "3-21g": -186.565,
                "6-31g": -187.675,
                "cc-pvdz": -187.723,
                "cc-pvtz": -187.968
            }
        }

    def get_available_systems(self) -> List[Dict[str, Any]]:
        """Get available molecular systems."""
        return self.SYSTEMS
    
    def get_available_basis_sets(self) -> List[Dict[str, Any]]:
        """Get available basis sets."""
        return self.BASIS_SETS
    
    def get_available_experiment_types(self) -> List[Dict[str, Any]]:
        """Get available experiment types."""
        return self.EXPERIMENT_TYPES

    def get_molecule_data(self, system_id: str) -> Dict[str, Any]:
        """Get molecule data for a given system ID."""
        for system in self.SYSTEMS:
            if system["id"] == system_id:
                return system
        raise ValueError(f"Unknown system ID: {system_id}")
    
    def run_ground_state_calculation(self, molecule_data: Dict[str, Any], basis_set: str, **kwargs) -> Dict[str, Any]:
        """Run a ground state energy calculation."""
        logger.info(f"Running ground state calculation for {molecule_data['name']} with {basis_set}")
        
        # Simulate calculation time
        self._simulate_calculation_time(molecule_data, basis_set)
        
        # Get reference energy from our mock data
        system_id = molecule_data["id"]
        reference_energy = self.reference_energies.get(system_id, {}).get(basis_set)
        
        if reference_energy is None:
            # If we don't have reference data, generate a plausible value
            reference_energy = -50.0 - (len(molecule_data["atoms"]) * 10.0) + random.uniform(-0.5, 0.5)
        
        # Add some random noise to simulate slightly different results
        energy = reference_energy + random.uniform(-0.001, 0.001)
        
        # Generate orbitals data
        num_orbitals = len(molecule_data["atoms"]) * 2
        orbitals = [
            {
                "index": i,
                "energy": -10.0 + i * 0.5 + random.uniform(-0.01, 0.01),
                "occupation": 2.0 if i < num_orbitals // 2 else 0.0,
                "symmetry": random.choice(["A1", "A2", "B1", "B2"])
            }
            for i in range(num_orbitals)
        ]
        
        # Calculate run time
        run_time = self._calculate_runtime(molecule_data, basis_set)
        
        return {
            "energy": energy,
            "reference_energy": reference_energy,
            "iterations": random.randint(10, 30),
            "runtime": run_time,
            "orbitals": orbitals,
            "converged": True,
            "dipole_moment": [random.uniform(-0.5, 0.5), random.uniform(-0.5, 0.5), random.uniform(-0.5, 0.5)],
            "method": "RHF",
            "basis_set": basis_set,
            "timestamp": datetime.now().isoformat()
        }
    
    def run_excited_state_calculation(self, molecule_data: Dict[str, Any], basis_set: str, **kwargs) -> Dict[str, Any]:
        """Run an excited state calculation."""
        logger.info(f"Running excited state calculation for {molecule_data['name']} with {basis_set}")
        
        # First run a ground state calculation
        ground_state = self.run_ground_state_calculation(molecule_data, basis_set, **kwargs)
        
        # Simulate calculation time (excited states take longer)
        self._simulate_calculation_time(molecule_data, basis_set, factor=1.5)
        
        # Number of excited states to calculate (default to 3)
        num_states = kwargs.get("num_states", 3)
        
        # Generate excited states
        excited_states = []
        for i in range(num_states):
            # Excitation energy increases with state number
            excitation_energy = (i + 1) * 0.1 + random.uniform(-0.02, 0.02)
            
            # Total energy is ground state plus excitation
            total_energy = ground_state["energy"] + excitation_energy
            
            # Generate oscillator strength (probability of transition)
            oscillator_strength = random.uniform(0.01, 1.0)
            
            excited_states.append({
                "state": i + 1,
                "excitation_energy_ev": excitation_energy * 27.2114,  # Convert to eV
                "excitation_energy": excitation_energy,
                "total_energy": total_energy,
                "oscillator_strength": oscillator_strength,
                "description": f"HOMO->{i} ({random.uniform(0.7, 0.95):.2f})"
            })
        
        # Calculate run time
        run_time = self._calculate_runtime(molecule_data, basis_set, factor=1.5)
        
        return {
            "energy": ground_state["energy"],
            "reference_energy": ground_state["reference_energy"],
            "iterations": random.randint(15, 45),
            "runtime": run_time,
            "excited_states": excited_states,
            "ground_state_data": ground_state,
            "method": "TD-RHF",
            "basis_set": basis_set,
            "timestamp": datetime.now().isoformat()
        }
    
    def run_geometry_optimization(self, molecule_data: Dict[str, Any], basis_set: str, **kwargs) -> Dict[str, Any]:
        """Run a geometry optimization calculation."""
        logger.info(f"Running geometry optimization for {molecule_data['name']} with {basis_set}")
        
        # Simulate calculation time (geometry optimizations take longer)
        self._simulate_calculation_time(molecule_data, basis_set, factor=2.0)
        
        # Get reference energy
        system_id = molecule_data["id"]
        reference_energy = self.reference_energies.get(system_id, {}).get(basis_set)
        
        if reference_energy is None:
            # If we don't have reference data, generate a plausible value
            reference_energy = -50.0 - (len(molecule_data["atoms"]) * 10.0) + random.uniform(-0.5, 0.5)
        
        # Add some random noise to simulate slightly different results
        energy = reference_energy + random.uniform(-0.001, 0.001)
        
        # Create a copy of the molecule's atoms and slightly modify the coordinates
        optimized_atoms = []
        for atom in molecule_data["atoms"]:
            optimized_atoms.append({
                "symbol": atom["symbol"],
                "x": atom["x"] + random.uniform(-0.02, 0.02),
                "y": atom["y"] + random.uniform(-0.02, 0.02),
                "z": atom["z"] + random.uniform(-0.02, 0.02)
            })
        
        # Simulate optimization steps
        num_steps = random.randint(5, 15)
        optimization_steps = []
        
        current_energy = energy + random.uniform(0.1, 0.3)  # Start with higher energy
        
        for i in range(num_steps):
            # Energy decreases with each step
            step_energy = current_energy - (current_energy - energy) * ((i + 1) / num_steps) + random.uniform(-0.001, 0.001)
            current_energy = step_energy
            
            # RMS gradient decreases with each step
            rms_gradient = 0.1 * (1.0 - (i / num_steps)) + random.uniform(-0.005, 0.005)
            
            optimization_steps.append({
                "step": i + 1,
                "energy": step_energy,
                "rms_gradient": rms_gradient,
                "max_force": rms_gradient * 2 + random.uniform(-0.01, 0.01)
            })
        
        # Calculate run time
        run_time = self._calculate_runtime(molecule_data, basis_set, factor=2.0)
        
        return {
            "energy": energy,
            "reference_energy": reference_energy,
            "iterations": random.randint(20, 50),
            "runtime": run_time,
            "optimized_geometry": {
                "atoms": optimized_atoms,
                "charge": molecule_data["charge"],
                "multiplicity": molecule_data["multiplicity"]
            },
            "optimization_steps": optimization_steps,
            "converged": True,
            "method": "RHF",
            "basis_set": basis_set,
            "timestamp": datetime.now().isoformat()
        }
    
    def run_vibrational_analysis(self, molecule_data: Dict[str, Any], basis_set: str, **kwargs) -> Dict[str, Any]:
        """Run a vibrational analysis calculation."""
        logger.info(f"Running vibrational analysis for {molecule_data['name']} with {basis_set}")
        
        # First run a geometry optimization
        opt_result = self.run_geometry_optimization(molecule_data, basis_set, **kwargs)
        
        # Simulate calculation time
        self._simulate_calculation_time(molecule_data, basis_set, factor=2.5)
        
        # Number of vibrational modes is 3N-6 for non-linear molecules (or 3N-5 for linear)
        num_atoms = len(molecule_data["atoms"])
        num_modes = 3 * num_atoms - 6
        
        # Generate vibrations
        vibrations = []
        for i in range(num_modes):
            # Frequencies generally increase with mode number
            # First few might be very low (or imaginary if saddle point)
            frequency = (i + 1) * 100 + random.uniform(-50, 50)
            
            # Intensities vary considerably
            intensity = random.uniform(0, 100)
            
            # Displacement vectors
            displacements = []
            for j in range(num_atoms):
                displacements.append({
                    "atom": j,
                    "dx": random.uniform(-0.1, 0.1),
                    "dy": random.uniform(-0.1, 0.1),
                    "dz": random.uniform(-0.1, 0.1)
                })
            
            vibrations.append({
                "mode": i + 1,
                "frequency": frequency,
                "intensity": intensity,
                "reduced_mass": random.uniform(1.0, 5.0),
                "force_constant": random.uniform(0.1, 0.5),
                "displacements": displacements
            })
        
        # Calculate run time
        run_time = self._calculate_runtime(molecule_data, basis_set, factor=2.5)
        
        return {
            "energy": opt_result["energy"],
            "reference_energy": opt_result["reference_energy"],
            "iterations": random.randint(30, 70),
            "runtime": run_time,
            "optimized_geometry": opt_result["optimized_geometry"],
            "vibrations": vibrations,
            "zero_point_energy": sum(max(0, v["frequency"]) for v in vibrations) * 0.5 / 4.184 / 1000,  # in kcal/mol
            "method": "RHF",
            "basis_set": basis_set,
            "timestamp": datetime.now().isoformat()
        }
    
    def run_dipole_moment(self, molecule_data: Dict[str, Any], basis_set: str, **kwargs) -> Dict[str, Any]:
        """Calculate molecular dipole moment."""
        logger.info(f"Running dipole moment calculation for {molecule_data['name']} with {basis_set}")
        
        # First run a ground state calculation
        ground_state = self.run_ground_state_calculation(molecule_data, basis_set, **kwargs)
        
        # Simulate a short calculation
        self._simulate_calculation_time(molecule_data, basis_set, factor=0.5)
        
        # Generate dipole components
        dx = random.uniform(-2.0, 2.0)
        dy = random.uniform(-2.0, 2.0)
        dz = random.uniform(-2.0, 2.0)
        
        # Total dipole
        total = (dx**2 + dy**2 + dz**2)**0.5
        
        # Calculate run time
        run_time = self._calculate_runtime(molecule_data, basis_set, factor=0.5)
        
        return {
            "energy": ground_state["energy"],
            "reference_energy": ground_state["reference_energy"],
            "iterations": ground_state["iterations"],
            "runtime": run_time,
            "dipole_moment": {
                "x": dx,
                "y": dy,
                "z": dz,
                "total": total
            },
            "method": "RHF",
            "basis_set": basis_set,
            "timestamp": datetime.now().isoformat()
        }
    
    def run_experiment(self, experiment_type: str, molecule_data: Dict[str, Any], basis_set: str, **kwargs) -> Dict[str, Any]:
        """Run an experiment based on its type."""
        if experiment_type == "ground_state":
            return self.run_ground_state_calculation(molecule_data, basis_set, **kwargs)
        elif experiment_type == "excited_state":
            return self.run_excited_state_calculation(molecule_data, basis_set, **kwargs)
        elif experiment_type == "geometry_optimization":
            return self.run_geometry_optimization(molecule_data, basis_set, **kwargs)
        elif experiment_type == "vibrational_analysis":
            return self.run_vibrational_analysis(molecule_data, basis_set, **kwargs)
        elif experiment_type == "dipole_moment":
            return self.run_dipole_moment(molecule_data, basis_set, **kwargs)
        else:
            raise ValueError(f"Unknown experiment type: {experiment_type}")

    def estimate_resources(self, molecule_data: Dict[str, Any], basis_set: str, experiment_type: str, **kwargs) -> Dict[str, Any]:
        """Estimate resources required for an experiment."""
        logger.info(f"Estimating resources for {experiment_type} on {molecule_data['name']} with {basis_set}")
        
        # Assign complexity factors based on molecule size, basis set, and experiment type
        num_atoms = len(molecule_data["atoms"])
        num_electrons = sum(self._get_num_electrons(atom["symbol"]) for atom in molecule_data["atoms"])
        
        # Basis set complexity factor
        basis_factors = {
            "sto-3g": 1.0,
            "3-21g": 2.0,
            "6-31g": 3.0,
            "cc-pvdz": 4.0,
            "cc-pvtz": 8.0
        }
        basis_factor = basis_factors.get(basis_set, 1.0)
        
        # Experiment type complexity factor
        experiment_factors = {
            "ground_state": 1.0,
            "excited_state": 2.5,
            "geometry_optimization": 3.0,
            "vibrational_analysis": 5.0,
            "dipole_moment": 1.2
        }
        experiment_factor = experiment_factors.get(experiment_type, 1.0)
        
        # Calculate memory requirements (in MB)
        memory_mb = num_electrons**2 * basis_factor * experiment_factor * 0.1
        
        # Calculate disk requirements (in MB)
        disk_mb = memory_mb * 5
        
        # Calculate CPU requirements (in core-hours)
        cpu_hours = num_electrons**2 * basis_factor * experiment_factor * 0.01
        
        # Calculate estimated runtime (in seconds)
        runtime_sec = cpu_hours * 3600 / 8  # Assuming 8 cores
        
        return {
            "memory_mb": round(memory_mb, 2),
            "disk_mb": round(disk_mb, 2),
            "cpu_hours": round(cpu_hours, 2),
            "estimated_runtime_sec": round(runtime_sec, 2),
            "estimated_runtime_human": self._format_time(runtime_sec),
            "basis_set_complexity": basis_factor,
            "experiment_complexity": experiment_factor,
            "molecule_size": {
                "atoms": num_atoms,
                "electrons": num_electrons
            }
        }

    def _simulate_calculation_time(self, molecule_data: Dict[str, Any], basis_set: str, factor: float = 1.0):
        """Simulate calculation time for more realistic response times."""
        # Calculate a reasonable time based on molecule size and basis set
        num_atoms = len(molecule_data["atoms"])
        
        # Basis set complexity factor
        basis_factors = {
            "sto-3g": 0.1,
            "3-21g": 0.2,
            "6-31g": 0.3,
            "cc-pvdz": 0.5,
            "cc-pvtz": 1.0
        }
        basis_factor = basis_factors.get(basis_set, 0.1)
        
        # Simulate calculation time (scaled down for testing purposes)
        # In a real system, this would take minutes to hours
        sim_time = num_atoms * basis_factor * factor * 0.05
        time.sleep(sim_time)

    def _calculate_runtime(self, molecule_data: Dict[str, Any], basis_set: str, factor: float = 1.0) -> float:
        """Calculate a realistic runtime for the calculation."""
        num_atoms = len(molecule_data["atoms"])
        
        # Basis set complexity factor
        basis_factors = {
            "sto-3g": 1.0,
            "3-21g": 2.0,
            "6-31g": 3.0,
            "cc-pvdz": 5.0,
            "cc-pvtz": 10.0
        }
        basis_factor = basis_factors.get(basis_set, 1.0)
        
        # Base time in seconds
        base_time = num_atoms**2 * basis_factor * factor
        
        # Add some randomness
        runtime = base_time * (0.8 + random.uniform(0, 0.4))
        
        return runtime

    def _get_num_electrons(self, element: str) -> int:
        """Get the number of electrons for an element."""
        element_electrons = {
            "H": 1, "He": 2, "Li": 3, "Be": 4, "B": 5, "C": 6, "N": 7, "O": 8, "F": 9, "Ne": 10,
            "Na": 11, "Mg": 12, "Al": 13, "Si": 14, "P": 15, "S": 16, "Cl": 17, "Ar": 18
        }
        return element_electrons.get(element, 6)  # Default to carbon if unknown

    def _format_time(self, seconds: float) -> str:
        """Format time in seconds to a human-readable string."""
        if seconds < 60:
            return f"{seconds:.1f} seconds"
        elif seconds < 3600:
            minutes = seconds / 60
            return f"{minutes:.1f} minutes"
        elif seconds < 86400:
            hours = seconds / 3600
            return f"{hours:.1f} hours"
        else:
            days = seconds / 86400
            return f"{days:.1f} days" 