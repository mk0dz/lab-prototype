# Quantum Chemistry Lab Backend

This is the backend for the Quantum Chemistry Lab application, providing API endpoints for quantum chemistry simulations using Qiskit-Nature.

## Features

- Quantum system management (atoms, molecules)
- Experiment configuration and execution
- Results storage and retrieval
- Integration with Qiskit-Nature for quantum chemistry calculations
- Custom antimatter simulation module

## Getting Started

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

### Installation

1. Create a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

### Running the Application

Start the FastAPI server with:

```bash
cd backend
uvicorn main:app --reload
```

The API will be available at http://localhost:8000.
API documentation will be available at http://localhost:8000/api/v1/docs.

## API Endpoints

### Systems

- `GET /api/v1/systems` - Get all available quantum systems
- `GET /api/v1/systems/{system_id}` - Get a specific quantum system
- `GET /api/v1/basis-sets` - Get all available basis sets
- `GET /api/v1/experiment-types` - Get all available experiment types

### Experiments

- `POST /api/v1/experiments` - Create a new experiment
- `GET /api/v1/experiments` - Get all experiments
- `GET /api/v1/experiments/{experiment_id}` - Get a specific experiment
- `POST /api/v1/experiments/{experiment_id}/run` - Run an experiment
- `POST /api/v1/estimate-resources` - Estimate computational resources

### Results

- `GET /api/v1/results` - Get all experiment results
- `GET /api/v1/results/{result_id}` - Get a specific result
- `GET /api/v1/experiments/{experiment_id}/results` - Get all results for an experiment
- `GET /api/v1/results/{result_id}/details` - Get detailed information about a result

## Architecture

The backend follows a clean architecture with:

- **API Layer**: FastAPI routes and endpoints
- **Business Logic**: Quantum module manager and adapters
- **Data Layer**: SQLAlchemy models and database

## License

This project is licensed under the MIT License. 