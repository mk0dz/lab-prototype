// src/components/config.tsx
import React, { useState, useEffect } from 'react';
import { PageLayout, SectionTitle, Card, NavigationFooter, SelectorButton } from './design-system';
import { useQuantumSystem } from './context';

interface ExperimentConfigProps {
  onNavigate: (section: string) => void;
}

// Define circuit gates for visualization
const gates = {
  x: { symbol: 'X', color: '#f87171' },
  h: { symbol: 'H', color: '#60a5fa' },
  cx: { symbol: 'CX', color: '#34d399' },
  rz: { symbol: 'RZ', color: '#a78bfa' },
  rx: { symbol: 'RX', color: '#f472b6' },
  ry: { symbol: 'RY', color: '#fbbf24' },
  z: { symbol: 'Z', color: '#a3e635' },
  s: { symbol: 'S', color: '#fb923c' },
  t: { symbol: 'T', color: '#c084fc' },
  swap: { symbol: 'SWAP', color: '#94a3b8' },
};

// Define types for circuit data
interface GateData {
  type: string;
  connected: number | null;
}

// Circuit Preview Component
const CircuitPreview = ({ ansatz, mapper, qubits = 4 }: { 
  ansatz: string | null, 
  mapper: string | null,
  qubits?: number 
}) => {
  const [circuitData, setCircuitData] = useState<GateData[][]>([]);

  // Generate mock circuit data based on the selections
  useEffect(() => {
    if (!ansatz || !mapper) {
      setCircuitData([]);
      return;
    }

    // Generate appropriate number of qubits
    const newCircuitData: GateData[][] = Array(qubits).fill(0).map(() => []);
    
    // Map depth based on ansatz
    const depth = ansatz === 'UCCSD' ? 8 : 
                 ansatz === 'HWE' ? 6 : 
                 ansatz === 'TwoLocal' ? 4 : 3;
    
    // Initial gates (always start with Hadamard gates)
    for (let i = 0; i < qubits; i++) {
      newCircuitData[i].push({ type: 'h', connected: null });
    }
    
    // Add gates based on ansatz type
    if (ansatz === 'UCCSD') {
      // UCCSD: Multiple layers of X, RZ and CNOT gates
      for (let d = 0; d < depth; d++) {
        // Add RZ gates on alternating qubits
        for (let i = 0; i < qubits; i++) {
          if (d % 2 === 0 && i % 2 === 0) {
            newCircuitData[i].push({ type: 'rz', connected: null });
          } else if (d % 2 === 1 && i % 2 === 1) {
            newCircuitData[i].push({ type: 'rz', connected: null });
          } else {
            newCircuitData[i].push({ type: 'empty', connected: null });
          }
        }
        
        // Add entangling CNOT gates
        for (let i = 0; i < qubits - 1; i++) {
          if (d % 2 === 0) {
            newCircuitData[i].push({ type: 'cx', connected: i + 1 });
            newCircuitData[i + 1].push({ type: 'cx_target', connected: i });
            i++; // Skip the next qubit as it's now a target
          } else {
            newCircuitData[i].push({ type: 'empty', connected: null });
          }
        }
        
        // Add empty slots for any qubits that didn't get gates
        for (let i = 0; i < qubits; i++) {
          while (newCircuitData[i].length <= d * 3 + 2) {
            newCircuitData[i].push({ type: 'empty', connected: null });
          }
        }
      }
      
    } else if (ansatz === 'HWE') {
      // Hardware-Efficient: Rotations and nearest-neighbor CNOTs
      for (let d = 0; d < depth; d++) {
        // Add rotation gates to all qubits
        for (let i = 0; i < qubits; i++) {
          const rotationType = d % 3 === 0 ? 'rx' : d % 3 === 1 ? 'ry' : 'rz';
          newCircuitData[i].push({ type: rotationType, connected: null });
        }
        
        // Add CNOT gates between neighboring qubits
        for (let i = 0; i < qubits - 1; i += 2) {
          newCircuitData[i].push({ type: 'cx', connected: i + 1 });
          newCircuitData[i + 1].push({ type: 'cx_target', connected: i });
        }
        
        // For odd numbers of qubits, handle the last layer slightly differently
        if (qubits % 2 === 1) {
          newCircuitData[qubits - 1].push({ type: 'empty', connected: null });
        }
        
        // Swap the order for the next layer
        if (d < depth - 1) {
          for (let i = 1; i < qubits - 1; i += 2) {
            if (i + 1 < qubits) {
              newCircuitData[i].push({ type: 'cx', connected: i + 1 });
              newCircuitData[i + 1].push({ type: 'cx_target', connected: i });
            }
          }
          
          // Handle first and last qubits
          newCircuitData[0].push({ type: 'empty', connected: null });
          if (qubits % 2 === 0) {
            newCircuitData[qubits - 1].push({ type: 'empty', connected: null });
          }
        }
      }
      
    } else {
      // TwoLocal or Custom: Simpler alternating layers
      for (let d = 0; d < depth; d++) {
        // Single-qubit gates
        for (let i = 0; i < qubits; i++) {
          const gateType = d % 2 === 0 ? 'rx' : 'rz';
          newCircuitData[i].push({ type: gateType, connected: null });
        }
        
        // Two-qubit gates
        for (let i = 0; i < qubits - 1; i++) {
          if (d % 2 === 0 && i % 2 === 0) {
            newCircuitData[i].push({ type: 'cx', connected: i + 1 });
            newCircuitData[i + 1].push({ type: 'cx_target', connected: i });
            i++; // Skip the next qubit
          } else if (d % 2 === 1 && i % 2 === 1) {
            newCircuitData[i].push({ type: 'cx', connected: i + 1 });
            newCircuitData[i + 1].push({ type: 'cx_target', connected: i });
            i++; // Skip the next qubit
          } else {
            newCircuitData[i].push({ type: 'empty', connected: null });
          }
        }
        
        // Ensure all rows have the same length
        const maxLen = Math.max(...newCircuitData.map(row => row.length));
        for (let i = 0; i < qubits; i++) {
          while (newCircuitData[i].length < maxLen) {
            newCircuitData[i].push({ type: 'empty', connected: null });
          }
        }
      }
    }
    
    // Final measurements
    for (let i = 0; i < qubits; i++) {
      newCircuitData[i].push({ type: 'measure', connected: null });
    }
    
    setCircuitData(newCircuitData);
  }, [ansatz, mapper, qubits]);

  if (!ansatz || !mapper || circuitData.length === 0) {
    return (
      <div className="border border-dashed border-gray-300 p-4 h-full flex items-center justify-center">
        <p className="text-gray-500">Select ansatz and mapper to preview circuit</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-max p-2">
        {/* Qubit labels */}
        <div className="flex">
          <div className="w-16 flex-shrink-0 font-mono text-xs font-bold p-1">
            Qubit
          </div>
          <div className="flex-grow flex">
            {/* Empty space for gates */}
          </div>
        </div>
        
        {/* Circuit grid */}
        {circuitData.map((row, qubitIdx) => (
          <div key={`q-${qubitIdx}`} className="flex items-center h-10">
            {/* Qubit label and line */}
            <div className="w-16 flex-shrink-0 font-mono text-xs flex items-center justify-between pr-1">
              <span>q[{qubitIdx}]</span>
              <span className="text-gray-400">→</span>
            </div>
            
            {/* Gates for this qubit */}
            <div className="flex-grow flex items-center border-b border-gray-200">
              {row.map((gate, gateIdx) => {
                // Handle empty slots
                if (gate.type === 'empty') {
                  return (
                    <div key={`g-${qubitIdx}-${gateIdx}`} className="w-10 h-8 flex items-center justify-center">
                      <div className="border-t border-gray-300 w-full"></div>
                    </div>
                  );
                }
                
                // Handle measurement
                if (gate.type === 'measure') {
                  return (
                    <div key={`g-${qubitIdx}-${gateIdx}`} className="w-10 h-8 flex items-center justify-center">
                      <div className="text-red-500 font-bold text-xs border border-red-500 rounded px-1">M</div>
                    </div>
                  );
                }
                
                // Handle CX target
                if (gate.type === 'cx_target') {
                  return (
                    <div key={`g-${qubitIdx}-${gateIdx}`} className="w-10 h-8 flex items-center justify-center">
                      <div className="w-4 h-4 rounded-full border-2 border-green-500"></div>
                    </div>
                  );
                }
                
                // Standard gate
                const gateInfo = gates[gate.type as keyof typeof gates] || { symbol: '?', color: '#888' };
                
                return (
                  <div key={`g-${qubitIdx}-${gateIdx}`} className="w-10 h-8 flex items-center justify-center relative">
                    <div 
                      className="w-8 h-8 flex items-center justify-center font-mono text-xs font-bold rounded"
                      style={{ backgroundColor: gateInfo.color }}
                    >
                      {gateInfo.symbol}
                    </div>
                    
                    {/* Draw control line for CX gate */}
                    {gate.type === 'cx' && gate.connected !== null && (
                      <div 
                        className="absolute w-1 bg-green-500" 
                        style={{ 
                          height: `${Math.abs(gate.connected - qubitIdx) * 40}px`,
                          top: gate.connected > qubitIdx ? '50%' : `calc(-${Math.abs(gate.connected - qubitIdx) * 40 - 20}px)`,
                        }}
                      ></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function ExperimentConfig({ onNavigate }: ExperimentConfigProps) {
  const { systemData, updateSystemData } = useQuantumSystem();
  const [selectedAnsatz, setSelectedAnsatz] = useState<string | null>(null);
  const [selectedMapper, setSelectedMapper] = useState<string | null>(null);
  const [selectedHamiltonian, setSelectedHamiltonian] = useState<string | null>(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string | null>(null);
  const [showCircuitPreview, setShowCircuitPreview] = useState<boolean>(false);
  const [advancedOptions, setAdvancedOptions] = useState<boolean>(false);
  
  // Set defaults from context if available
  useEffect(() => {
    if (systemData.configuration) {
      setSelectedAnsatz(systemData.configuration.ansatz || 'TwoLocal');
      setSelectedMapper(systemData.configuration.mapper || 'JW');
      setSelectedHamiltonian(systemData.configuration.hamiltonian || 'ElectronicStructure');
      setSelectedAlgorithm(systemData.configuration.algorithm || 'VQE');
    }
  }, [systemData]);
  
  // Configuration options with descriptions
  const ansatzOptions = [
    { id: 'UCCSD', name: 'UCCSD', description: 'Unitary Coupled Cluster Singles Doubles' },
    { id: 'HWE', name: 'Hardware-Efficient', description: 'Optimized for specific quantum hardware' },
    { id: 'TwoLocal', name: 'Two-Local', description: 'Parameterized rotation and entanglement gates' },
    { id: 'Custom', name: 'Custom', description: 'Define your own ansatz circuit' }
  ];
  
  const mapperOptions = [
    { id: 'JW', name: 'Jordan-Wigner', description: 'Simple mapping but non-local interactions' },
    { id: 'Parity', name: 'Parity', description: 'Improved locality for certain interactions' },
    { id: 'BK', name: 'Bravyi-Kitaev', description: 'Balance between locality and complexity' },
    { id: 'Custom', name: 'Custom', description: 'Define your own qubit mapping' }
  ];
  
  const hamiltonianOptions = [
    { id: 'ElectronicStructure', name: 'Electronic Structure', description: 'For atomic and molecular systems' },
    { id: 'FermiHubbard', name: 'Fermi-Hubbard', description: 'For solid-state physics models' },
    { id: 'CustomH', name: 'Custom', description: 'Define your own Hamiltonian terms' }
  ];
  
  const algorithmOptions = [
    { id: 'VQE', name: 'VQE', description: 'Variational Quantum Eigensolver' },
    { id: 'QAOA', name: 'QAOA', description: 'Quantum Approximate Optimization Algorithm' },
    { id: 'QPE', name: 'QPE', description: 'Quantum Phase Estimation (high precision)' },
    { id: 'NumPy', name: 'NumPy Eigensolver', description: 'Classical reference calculation' }
  ];
  
  // Resource estimator calculations (simplified)
  const calculateResources = () => {
    let qubits = 4; // Base requirement
    let depth = 10; // Base depth
    
    if (selectedAnsatz === 'UCCSD') qubits += 4;
    if (selectedAnsatz === 'HWE') depth += 20;
    if (selectedMapper === 'JW') qubits *= 1.5;
    if (selectedAlgorithm === 'QPE') {
      qubits *= 2;
      depth *= 3;
    }
    
    return {
      qubits: Math.ceil(qubits),
      depth: Math.ceil(depth),
      runtime: `~${Math.ceil(depth * 0.1)} seconds`
    };
  };
  
  const resources = calculateResources();
  
  // Check if configuration is complete
  const isConfigComplete = selectedAnsatz && selectedMapper && selectedHamiltonian && selectedAlgorithm;
  
  // Update context when configuration is complete
  useEffect(() => {
    if (isConfigComplete) {
      updateSystemData({
        configuration: {
          ansatz: selectedAnsatz,
          mapper: selectedMapper,
          hamiltonian: selectedHamiltonian,
          algorithm: selectedAlgorithm
        }
      });
    }
  }, [selectedAnsatz, selectedMapper, selectedHamiltonian, selectedAlgorithm, updateSystemData, isConfigComplete]);

  return (
    <PageLayout>
      <SectionTitle 
        title="Experiment Configurator" 
        subtitle="Step 3/4"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 overflow-y-auto max-h-[calc(100vh-10rem)]">
        {/* Left Column - Main Options */}
        <div className="md:col-span-2 space-y-6">
          {/* Ansatz Section */}
          <Card>
            <h3 className="text-xl font-serif mb-4">Ansatz Selection</h3>
            <div className="grid grid-cols-2 gap-4">
              {ansatzOptions.map(option => (
                <SelectorButton
                  key={option.id}
                  selected={selectedAnsatz === option.id}
                  onClick={() => setSelectedAnsatz(option.id)}
                >
                  <div className="py-2">
                    <div className="font-bold">{option.name}</div>
                    <div className="text-xs mt-1 text-gray-600">{option.description}</div>
                  </div>
                </SelectorButton>
              ))}
            </div>
            
            {selectedAnsatz === 'Custom' && (
              <div className="mt-4 p-3 border border-dashed border-gray-300">
                <p className="text-sm text-gray-600">In the full implementation, custom ansatz builder would appear here.</p>
              </div>
            )}
          </Card>

          {/* Mapper Section */}
          <Card>
            <h3 className="text-xl font-serif mb-4">Qubit Mapper</h3>
            <div className="grid grid-cols-2 gap-4">
              {mapperOptions.map(option => (
                <SelectorButton
                  key={option.id}
                  selected={selectedMapper === option.id}
                  onClick={() => setSelectedMapper(option.id)}
                >
                  <div className="py-2">
                    <div className="font-bold">{option.name}</div>
                    <div className="text-xs mt-1 text-gray-600">{option.description}</div>
                  </div>
                </SelectorButton>
              ))}
            </div>
          </Card>

          {/* Hamiltonian Section */}
          <Card>
            <h3 className="text-xl font-serif mb-4">Hamiltonian Type</h3>
            <div className="grid grid-cols-3 gap-4">
              {hamiltonianOptions.map(option => (
                <SelectorButton
                  key={option.id}
                  selected={selectedHamiltonian === option.id}
                  onClick={() => setSelectedHamiltonian(option.id)}
                >
                  <div className="py-2">
                    <div className="font-bold">{option.name}</div>
                    <div className="text-xs mt-1 text-gray-600">{option.description}</div>
                  </div>
                </SelectorButton>
              ))}
            </div>
          </Card>

          {/* Algorithm Section */}
          <Card>
            <h3 className="text-xl font-serif mb-4">Algorithm Selection</h3>
            <div className="grid grid-cols-2 gap-4">
              {algorithmOptions.map(option => (
                <SelectorButton
                  key={option.id}
                  selected={selectedAlgorithm === option.id}
                  onClick={() => setSelectedAlgorithm(option.id)}
                >
                  <div className="py-2">
                    <div className="font-bold">{option.name}</div>
                    <div className="text-xs mt-1 text-gray-600">{option.description}</div>
                  </div>
                </SelectorButton>
              ))}
            </div>
          </Card>
        </div>
        
        {/* Right Column - Summary & Advanced */}
        <div className="space-y-6">
          {/* Resource Estimator */}
          <Card>
            <h3 className="text-xl font-serif mb-4">Resource Estimator</h3>
            <div className="space-y-3 font-mono">
              <div className="flex justify-between border-b pb-2">
                <span>Qubits Required:</span>
                <span className="font-bold">{resources.qubits}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span>Circuit Depth:</span>
                <span className="font-bold">{resources.depth}</span>
              </div>
              <div className="flex justify-between">
                <span>Est. Runtime:</span>
                <span className="font-bold">{resources.runtime}</span>
              </div>
            </div>
          </Card>
          
          {/* Configuration Summary */}
          <Card>
            <h3 className="text-xl font-serif mb-4">Configuration Summary</h3>
            <div className="space-y-2 font-mono text-sm">
              <div className="flex">
                <span className="w-24 font-bold">Ansatz:</span>
                <span>{selectedAnsatz || '—'}</span>
              </div>
              <div className="flex">
                <span className="w-24 font-bold">Mapper:</span>
                <span>{selectedMapper || '—'}</span>
              </div>
              <div className="flex">
                <span className="w-24 font-bold">Hamiltonian:</span>
                <span>{selectedHamiltonian || '—'}</span>
              </div>
              <div className="flex">
                <span className="w-24 font-bold">Algorithm:</span>
                <span>{selectedAlgorithm || '—'}</span>
              </div>
            </div>
            
            <div className="mt-4 border-t pt-4">
              <button
                className="w-full py-2 px-4 border border-black hover:bg-black hover:text-white transition-colors"
                onClick={() => setShowCircuitPreview(!showCircuitPreview)}
              >
                {showCircuitPreview ? 'Hide Circuit Preview' : 'Show Circuit Preview'}
              </button>
            </div>
          </Card>
          
          {/* Circuit Preview */}
          {showCircuitPreview && (
            <Card className="h-[300px] overflow-y-auto">
              <h3 className="text-xl font-serif mb-4">Circuit Preview</h3>
              <CircuitPreview 
                ansatz={selectedAnsatz} 
                mapper={selectedMapper}
                qubits={resources.qubits}
              />
            </Card>
          )}
        </div>
      </div>

      <NavigationFooter
        onBack={() => onNavigate('detailed-quantum')}
        onNext={() => {
          if (isConfigComplete) {
            onNavigate('results');
          }
        }}
        nextDisabled={!isConfigComplete}
        backLabel="Previous"
        nextLabel="Run Experiment"
      />
    </PageLayout>
  );
}