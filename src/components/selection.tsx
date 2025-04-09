// src/components/selection.tsx
import React, { useState } from 'react';
import { PageLayout, SectionTitle, SelectorButton, NavigationFooter, Card } from './design-system';
import { useQuantumSystem } from './context';

interface QuantumSystemSelectionProps {
  onNavigate: (section: string) => void;
}

export default function QuantumSystemSelection({ onNavigate }: QuantumSystemSelectionProps) {
  const { updateSystemData } = useQuantumSystem();
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);
  const [selectedBasis, setSelectedBasis] = useState<string | null>(null);
  const [selectedExperimentType, setSelectedExperimentType] = useState<string | null>(null);

  // Handle navigation to next screen, updating context before navigating
  const handleNextNavigation = () => {
    if (selectedSystem && selectedBasis && selectedExperimentType) {
      updateSystemData({
        systemId: selectedSystem,
        basisSet: selectedBasis,
        experimentType: selectedExperimentType
      });
      onNavigate('detailed-quantum');
    }
  };

  // System options with tooltips
  const systemOptions = [
    { id: 'H', name: 'Hydrogen', description: 'Simplest atom, one proton and electron' },
    { id: 'He', name: 'Helium', description: 'Noble gas with 2 electrons' },
    { id: 'Li', name: 'Lithium', description: 'Alkali metal with 3 electrons' },
    { id: 'H2', name: 'Hydrogen (H₂)', description: 'Simplest molecule, good for beginners' },
    { id: 'LiH', name: 'Lithium Hydride', description: 'Standard benchmark molecule' },
    { id: 'H2O', name: 'Water (H₂O)', description: 'Important biological molecule' },
  ];

  // Basis set options with descriptions
  const basisSetOptions = [
    { id: 'STO-3G', name: 'STO-3G', group: 'Minimal', description: 'Minimal basis set, fast but less accurate' },
    { id: 'cc-pVDZ', name: 'cc-pVDZ', group: 'Double-zeta', description: 'Good balance of accuracy and speed' },
    { id: 'cc-pVTZ', name: 'cc-pVTZ', group: 'Triple-zeta', description: 'High accuracy but computationally intensive' },
  ];

  // Experiment type options
  const experimentTypes = [
    { id: 'ground', name: 'Ground State', description: 'Calculate lowest energy state' },
    { id: 'excited', name: 'Excited States', description: 'Calculate higher energy levels' },
    { id: 'properties', name: 'Properties', description: 'Calculate molecular properties' },
    { id: 'custom', name: 'Custom', description: 'Advanced configuration' },
  ];

  // Helper for displaying tooltips
  const Tooltip = ({ children, tooltip }: { children: React.ReactNode; tooltip: string }) => {
    return (
      <div className="group relative">
        {children}
        <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 w-48 p-2 bg-black text-white text-xs font-mono
                     invisible group-hover:visible z-10">
          {tooltip}
        </div>
      </div>
    );
  };

  return (
    <PageLayout>
      <SectionTitle 
        title="Quantum System Selection" 
        subtitle={`Step 1/4`} 
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 h-[calc(100vh-160px)]">
        {/* System Selection Panel */}
        <Card className="md:col-span-1 h-full">
          <h3 className="text-lg font-bold mb-3 font-serif">Select System</h3>
          <div className="space-y-2">
            {systemOptions.map(system => (
              <Tooltip key={system.id} tooltip={system.description}>
                <button
                  className={`w-full py-2 px-3 text-left border ${
                    selectedSystem === system.id ? 'bg-black text-white' : 'border-black'
                  } rounded`}
                  onClick={() => setSelectedSystem(system.id)}
                >
                  {system.name}
                </button>
              </Tooltip>
            ))}
          </div>
        </Card>

        {/* Main Configuration Area */}
        <div className="md:col-span-2 space-y-4 h-full flex flex-col">
          {/* Experiment Type Panel */}
          <Card className="flex-grow-0">
            <h3 className="text-lg font-bold mb-3 font-serif">Experiment Type</h3>
            <div className="grid grid-cols-2 gap-3">
              {experimentTypes.map(type => (
                <SelectorButton
                  key={type.id}
                  selected={selectedExperimentType === type.id}
                  onClick={() => setSelectedExperimentType(type.id)}
                  disabled={!selectedSystem}
                >
                  <div className="text-center py-1">
                    <div className="font-medium">{type.name}</div>
                    <div className="text-xs mt-1 text-gray-600">{type.description}</div>
                  </div>
                </SelectorButton>
              ))}
            </div>
          </Card>

          {/* Basis Set Panel */}
          <Card className="flex-grow-0">
            <h3 className="text-lg font-bold mb-3 font-serif">Basis Set</h3>
            <div className="space-y-2">
              {/* Group basis sets */}
              {['Minimal', 'Double-zeta', 'Triple-zeta'].map(group => (
                <div key={group}>
                  <div className="text-sm font-mono mb-1">{group}</div>
                  <div className="flex space-x-2 flex-wrap">
                    {basisSetOptions
                      .filter(basis => basis.group === group)
                      .map(basis => (
                        <Tooltip key={basis.id} tooltip={basis.description}>
                          <button
                            className={`my-1 py-1 px-3 border rounded ${
                              selectedBasis === basis.id ? 'bg-black text-white' : 'border-black'
                            }`}
                            onClick={() => setSelectedBasis(basis.id)}
                            disabled={!selectedSystem}
                          >
                            {basis.name}
                          </button>
                        </Tooltip>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Information Panel */}
          <Card className="flex-grow">
            <h3 className="text-lg font-bold mb-3 font-serif">System Information</h3>
            {selectedSystem ? (
              <div className="font-mono text-sm">
                <p><span className="font-bold">Selected System:</span> {systemOptions.find(s => s.id === selectedSystem)?.name}</p>
                {selectedBasis && (
                  <p><span className="font-bold">Basis Set:</span> {basisSetOptions.find(b => b.id === selectedBasis)?.name}</p>
                )}
                {selectedExperimentType && (
                  <p><span className="font-bold">Experiment Type:</span> {experimentTypes.find(e => e.id === selectedExperimentType)?.name}</p>
                )}
                <p className="mt-2 text-sm text-gray-600">Ready to proceed to detailed configuration.</p>
              </div>
            ) : (
              <p className="text-gray-500">Please select a quantum system to continue.</p>
            )}
          </Card>
        </div>
      </div>

      <NavigationFooter
        onBack={() => onNavigate('welcome')}
        onNext={handleNextNavigation}
        nextLabel="Next: Detailed Configuration"
        nextDisabled={!selectedSystem || !selectedBasis || !selectedExperimentType}
      />
    </PageLayout>
  );
}