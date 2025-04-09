import { createContext, useContext, useState, ReactNode } from 'react';

// Define the structure of our context data
interface QuantumSystemData {
  systemId: string;
  basisSet: string;
  experimentType: string;
}

// Create context with default values
interface QuantumContextType {
  systemData: QuantumSystemData;
  updateSystemData: (data: Partial<QuantumSystemData>) => void;
}

const defaultContextValue: QuantumContextType = {
  systemData: {
    systemId: '',
    basisSet: '',
    experimentType: '',
  },
  updateSystemData: () => {},
};

// Create the context
const QuantumContext = createContext<QuantumContextType>(defaultContextValue);

// Create a provider component
export const QuantumProvider = ({ children }: { children: ReactNode }) => {
  const [systemData, setSystemData] = useState<QuantumSystemData>({
    systemId: '',
    basisSet: '',
    experimentType: '',
  });

  const updateSystemData = (data: Partial<QuantumSystemData>) => {
    setSystemData(prev => ({ ...prev, ...data }));
  };

  return (
    <QuantumContext.Provider value={{ systemData, updateSystemData }}>
      {children}
    </QuantumContext.Provider>
  );
};

// Create a custom hook to use the context
export const useQuantumSystem = () => useContext(QuantumContext); 