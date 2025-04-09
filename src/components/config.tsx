// src/components/config.tsx
import React, { useState } from 'react';
import { PageLayout, SectionTitle, Card, NavigationFooter, SelectorButton } from './design-system';

interface ExperimentConfigProps {
  onNavigate: (section: string) => void;
}

export default function ExperimentConfig({ onNavigate }: ExperimentConfigProps) {
  const [selectedAnsatz, setSelectedAnsatz] = useState<string | null>(null);
  const [selectedMapper, setSelectedMapper] = useState<string | null>(null);
  const [selectedHamiltonian, setSelectedHamiltonian] = useState<string | null>(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string | null>(null);
  const [advancedOptions, setAdvancedOptions] = useState<boolean>(false);
  
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

  return (
    <PageLayout>
      <SectionTitle 
        title="Experiment Configurator" 
        subtitle="Step 3/4"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
            
            <div className="mt-6">
              <button 
                className="border border-black px-4 py-2 w-full text-center" 
                onClick={() => setAdvancedOptions(!advancedOptions)}
              >
                {advancedOptions ? 'Hide Advanced Options' : 'Show Advanced Options'}
              </button>
            </div>
          </Card>
          
          {/* Advanced Options (collapsible) */}
          {advancedOptions && (
            <Card>
              <h3 className="text-xl font-serif mb-4">Advanced Options</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Convergence Criteria</label>
                  <input type="text" className="border border-gray-300 px-3 py-2 w-full" defaultValue="1e-6" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Maximum Iterations</label>
                  <input type="number" className="border border-gray-300 px-3 py-2 w-full" defaultValue="1000" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Initial Point</label>
                  <select className="border border-gray-300 px-3 py-2 w-full">
                    <option>Zero</option>
                    <option>Random</option>
                    <option>Custom</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Error Mitigation</label>
                  <div className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">Enable measurement error mitigation</span>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
      
      {/* Circuit Visualization */}
      <Card className="mb-6">
        <h3 className="text-xl font-serif mb-4">Circuit Preview</h3>
        <div className="border border-gray-200 bg-gray-50 h-40 flex items-center justify-center">
          {isConfigComplete ? (
            <div className="text-center font-mono">
              <p>Circuit visualization would appear here</p>
              <p className="text-sm text-gray-500 mt-2">(Based on selected ansatz, mapper, and algorithm)</p>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <p>Complete the configuration to preview the quantum circuit</p>
            </div>
          )}
        </div>
      </Card>
      
      {/* Navigation */}
      <NavigationFooter
        onBack={() => onNavigate('detailed-quantum')}
        onNext={() => onNavigate('results')}
        nextLabel="Run Experiment"
        nextDisabled={!isConfigComplete}
      />
    </PageLayout>
  );
}