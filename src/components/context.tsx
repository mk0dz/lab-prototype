import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import api from '../app/api';

// Define the structure of our context data
interface QuantumSystemData {
  systemId: string;
  basisSet: string;
  experimentType: string;
  configuration: any;
}

interface SystemsData {
  systems: Array<any>;
  basisSets: Array<any>;
  experimentTypes: Array<any>;
  loading: boolean;
  error: string | null;
}

interface ExperimentData {
  currentExperiment: any | null;
  experimentResults: Array<any>;
  loading: boolean;
  error: string | null;
}

// Create context with default values
interface QuantumContextType {
  systemData: QuantumSystemData;
  systemsData: SystemsData;
  experimentData: ExperimentData;
  updateSystemData: (data: Partial<QuantumSystemData>) => void;
  createAndRunExperiment: () => Promise<any>;
  fetchSystems: () => Promise<void>;
  fetchBasisSets: () => Promise<void>;
  fetchExperimentTypes: () => Promise<void>;
}

const defaultContextValue: QuantumContextType = {
  systemData: {
    systemId: '',
    basisSet: '',
    experimentType: '',
    configuration: {},
  },
  systemsData: {
    systems: [],
    basisSets: [],
    experimentTypes: [],
    loading: false,
    error: null,
  },
  experimentData: {
    currentExperiment: null,
    experimentResults: [],
    loading: false,
    error: null,
  },
  updateSystemData: () => {},
  createAndRunExperiment: async () => null,
  fetchSystems: async () => {},
  fetchBasisSets: async () => {},
  fetchExperimentTypes: async () => {},
};

// Create the context
const QuantumContext = createContext<QuantumContextType>(defaultContextValue);

// Create a provider component
export const QuantumProvider = ({ children }: { children: ReactNode }) => {
  const [systemData, setSystemData] = useState<QuantumSystemData>({
    systemId: '',
    basisSet: '',
    experimentType: '',
    configuration: {},
  });

  const [systemsData, setSystemsData] = useState<SystemsData>({
    systems: [],
    basisSets: [],
    experimentTypes: [],
    loading: false,
    error: null,
  });

  const [experimentData, setExperimentData] = useState<ExperimentData>({
    currentExperiment: null,
    experimentResults: [],
    loading: false,
    error: null,
  });

  const updateSystemData = useCallback((data: Partial<QuantumSystemData>) => {
    setSystemData(prev => ({ ...prev, ...data }));
  }, []);

  const fetchSystems = useCallback(async () => {
    setSystemsData(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await api.systems.getSystems();
      setSystemsData(prev => ({ ...prev, systems: response.systems, loading: false }));
    } catch (error) {
      console.error('Error fetching systems:', error);
      setSystemsData(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Unknown error fetching systems'
      }));
    }
  }, []);

  const fetchBasisSets = useCallback(async () => {
    setSystemsData(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await api.systems.getBasisSets();
      setSystemsData(prev => ({ ...prev, basisSets: response.basis_sets, loading: false }));
    } catch (error) {
      console.error('Error fetching basis sets:', error);
      setSystemsData(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Unknown error fetching basis sets'
      }));
    }
  }, []);

  const fetchExperimentTypes = useCallback(async () => {
    setSystemsData(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await api.systems.getExperimentTypes();
      setSystemsData(prev => ({ ...prev, experimentTypes: response.experiment_types, loading: false }));
    } catch (error) {
      console.error('Error fetching experiment types:', error);
      setSystemsData(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Unknown error fetching experiment types'
      }));
    }
  }, []);

  const createAndRunExperiment = useCallback(async () => {
    setExperimentData(prev => ({ ...prev, loading: true, error: null }));
    try {
      // Make sure configuration has the right format
      const configuration = {
        // Default algorithm and mapper values
        algorithm: "VQE",
        mapper: "JW",
        ansatz: "TwoLocal",
        hamiltonian: "Electronic Structure",
        maxiter: 100,
        ...systemData.configuration
      };
      
      // Create experiment - convert system ID to lowercase for backend compatibility
      const systemId = systemData.systemId.toLowerCase();
      
      const experimentPayload = {
        name: `Experiment ${systemData.systemId}`,
        system_id: systemId,
        basis_set: systemData.basisSet,
        experiment_type: systemData.experimentType,
        configuration: configuration
      };
      
      console.log('Creating experiment with payload:', experimentPayload);
      const experiment = await api.experiments.createExperiment(experimentPayload);
      
      // Run experiment
      console.log('Running experiment:', experiment.id);
      const result = await api.experiments.runExperiment(experiment.id);
      
      setExperimentData(prev => ({ 
        ...prev,
        currentExperiment: experiment,
        experimentResults: [...prev.experimentResults, result],
        loading: false
      }));
      
      return result;
    } catch (error) {
      console.error('Error creating/running experiment:', error);
      setExperimentData(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Unknown error with experiment'
      }));
      throw error;
    }
  }, [systemData]);

  // Fetch systems on component mount - only once
  useEffect(() => {
    // Initial data fetch
    fetchSystems();
    fetchBasisSets();
    fetchExperimentTypes();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <QuantumContext.Provider 
      value={{ 
        systemData, 
        systemsData,
        experimentData,
        updateSystemData, 
        createAndRunExperiment,
        fetchSystems,
        fetchBasisSets,
        fetchExperimentTypes,
      }}
    >
      {children}
    </QuantumContext.Provider>
  );
};

// Create a custom hook to use the context
export const useQuantumSystem = () => useContext(QuantumContext); 