// src/components/detail.tsx
import React from 'react';
import { PageLayout, SectionTitle, Card, NavigationFooter } from './design-system';
import QuantumVisualizationComponent from './visualization';
import { useQuantumSystem } from './context';

interface DetailedQuantumSelectionProps {
  onNavigate: (section: string) => void;
}

export default function DetailedQuantumSelection({ onNavigate }: DetailedQuantumSelectionProps) {
  const { systemData } = useQuantumSystem();
  const selectedSystem = systemData.systemId;
  
  // Sample molecular data for additional information
  const molecularInfo = {
    'H': {
      fullName: 'Hydrogen',
      electronCount: 1,
      qubitRequirement: 2,
      bond: null,
      symmetry: 'Spherical',
      description: 'The simplest atom with one proton and one electron. Ideal for basic quantum simulations.'
    },
    'He': {
      fullName: 'Helium',
      electronCount: 2,
      qubitRequirement: 4,
      bond: null,
      symmetry: 'Spherical',
      description: 'Noble gas with a filled 1s orbital. Demonstrates electron pairing in quantum simulations.'
    },
    'H2': {
      fullName: 'Hydrogen Molecule',
      electronCount: 2,
      qubitRequirement: 4,
      bond: '0.74 Å',
      symmetry: 'D∞h',
      description: 'The simplest molecule with one covalent bond. A standard benchmark for quantum chemistry algorithms.'
    },
    'LiH': {
      fullName: 'Lithium Hydride',
      electronCount: 4,
      qubitRequirement: 8,
      bond: '1.60 Å',
      symmetry: 'C∞v',
      description: 'An ionic compound with interesting electronic structure. Commonly used to test quantum chemistry methods.'
    },
    'H2O': {
      fullName: 'Water',
      electronCount: 10,
      qubitRequirement: 14,
      bond: 'O-H: 0.96 Å',
      symmetry: 'C2v',
      description: 'Water molecule with bent geometry. Important for biological and chemical simulations.'
    }
  };
  
  // Get the data for the selected system
  const systemDetails = selectedSystem ? molecularInfo[selectedSystem as keyof typeof molecularInfo] || null : null;

  return (
    <PageLayout>
      <div className="overflow-container">
        <SectionTitle 
          title="System Visualization & Properties" 
          subtitle="Step 2/4"
        />

        {/* Main Content */}
        <div className="flex flex-col h-[calc(100vh-240px)]">
          {/* Main Visualization Area - Takes up most of the height */}
          <div className="flex-grow overflow-auto">
            {selectedSystem ? (
              <QuantumVisualizationComponent />
            ) : (
              <Card className="flex items-center justify-center h-64 text-gray-500">
                <p>No system selected. Please go back and select a quantum system.</p>
              </Card>
            )}
          </div>
          
          {/* Additional Information Panel - Fixed at bottom */}
          {selectedSystem && systemDetails && (
            <Card className="mt-4 p-4 bg-gray-50 border-t border-gray-200">
              <div className="font-mono text-sm max-w-3xl mx-auto">
                <div className="flex flex-wrap gap-4 justify-center">
                  <div className="flex items-center">
                    <span className="font-bold mr-2">System:</span>
                    <span className="bg-black text-white px-2 py-1 rounded">{selectedSystem}</span>
                    {systemDetails.fullName && <span className="ml-2">{systemDetails.fullName}</span>}
                  </div>
                  
                  <div>
                    <span className="font-bold mr-2">Qubits:</span>
                    <span>{systemDetails.qubitRequirement}</span>
                  </div>
                  
                  <div>
                    <span className="font-bold mr-2">Electrons:</span>
                    <span>{systemDetails.electronCount}</span>
                  </div>
                  
                  {systemDetails.bond && (
                    <div>
                      <span className="font-bold mr-2">Bond:</span>
                      <span>{systemDetails.bond}</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
      
      {/* Navigation */}
      <NavigationFooter
        onBack={() => onNavigate('quantum-system')}
        onNext={() => onNavigate('experiment-config')}
        nextLabel="Next: Configure Experiment"
        nextDisabled={!selectedSystem}
      />
    </PageLayout>
  );
}