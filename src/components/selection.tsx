// src/components/selection.tsx
import React, { useState, useEffect } from 'react';
import { PageLayout, SectionTitle, SelectorButton, NavigationFooter, Card } from './design-system';
import { useQuantumSystem } from './context';

interface QuantumSystemSelectionProps {
  onNavigate: (section: string) => void;
}

export default function QuantumSystemSelection({ onNavigate }: QuantumSystemSelectionProps) {
  const { updateSystemData, systemsData, fetchSystems, fetchBasisSets, fetchExperimentTypes } = useQuantumSystem();
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);
  const [selectedBasis, setSelectedBasis] = useState<string | null>(null);
  const [selectedExperimentType, setSelectedExperimentType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch data if not available
  useEffect(() => {
    const fetchDataIfNeeded = async () => {
      setIsLoading(true);
      try {
        if (systemsData.systems.length === 0) {
          await fetchSystems();
        }
        if (systemsData.basisSets.length === 0) {
          await fetchBasisSets();
        }
        if (systemsData.experimentTypes.length === 0) {
          await fetchExperimentTypes();
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDataIfNeeded();
  }, [fetchSystems, fetchBasisSets, fetchExperimentTypes]);

  // Handle navigation to next screen, updating context before navigating
  const handleNextNavigation = () => {
    if (selectedSystem && selectedBasis && selectedExperimentType) {
      updateSystemData({
        systemId: selectedSystem.toLowerCase(),
        basisSet: selectedBasis,
        experimentType: selectedExperimentType
      });
      onNavigate('detailed-quantum');
    }
  };

  // Define a type for basis set data
  interface BasisSetData {
    id: string;
    name: string;
    description?: string;
    group?: string;
  }

  // Group basis sets by type/group
  const groupedBasisSets = systemsData.basisSets.reduce((acc, basis) => {
    // Extract group from description if not available
    const group = basis.group || (
      basis.description?.includes('Minimal') ? 'Minimal' :
      basis.description?.includes('Double') ? 'Double-zeta' :
      basis.description?.includes('Triple') ? 'Triple-zeta' : 'Other'
    );
    
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(basis);
    return acc;
  }, {} as Record<string, BasisSetData[]>);

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

  // Fallback data in case API fails
  const fallbackSystemOptions = [
    { id: 'h2o', name: 'Water', description: 'Water molecule (H2O)' },
    { id: 'ch4', name: 'Methane', description: 'Methane molecule (CH4)' },
    { id: 'nh3', name: 'Ammonia', description: 'Ammonia molecule (NH3)' },
    { id: 'co2', name: 'Carbon Dioxide', description: 'Carbon dioxide molecule (CO2)' },
  ];

  const fallbackBasisSetOptions = [
    { id: 'sto-3g', name: 'STO-3G', description: 'Minimal basis set, fast but less accurate' },
    { id: 'cc-pvdz', name: 'cc-pVDZ', description: 'Correlation consistent polarized valence double zeta basis set' },
    { id: 'cc-pvtz', name: 'cc-pVTZ', description: 'Correlation consistent polarized valence triple zeta basis set' },
  ];

  const fallbackExperimentTypes = [
    { id: 'ground', name: 'Ground State', description: 'Calculate ground state energy' },
    { id: 'excited', name: 'Excited State', description: 'Calculate excited state properties' },
    { id: 'geometry', name: 'Geometry Optimization', description: 'Optimize molecular geometry' },
    { id: 'vibrational', name: 'Vibrational Analysis', description: 'Calculate vibrational frequencies' },
    { id: 'dipole', name: 'Dipole Moment', description: 'Calculate molecular dipole moment' },
  ];

  // Use API data if available, otherwise use fallback data
  const systemOptions = systemsData.systems.length > 0 ? systemsData.systems : fallbackSystemOptions;
  const basisSetOptions = systemsData.basisSets.length > 0 ? systemsData.basisSets : fallbackBasisSetOptions;
  const experimentTypes = systemsData.experimentTypes.length > 0 ? systemsData.experimentTypes : fallbackExperimentTypes;

  return (
    <PageLayout>
      <SectionTitle 
        title="Quantum System Selection" 
        subtitle={`Step 1/4`} 
      />

      {systemsData.error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md">
          Error loading data: {systemsData.error}. Using fallback data.
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center h-[calc(100vh-160px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
      ) : (
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
                {Object.keys(groupedBasisSets).length > 0 ? (
                  Object.entries(groupedBasisSets).map(([group, bases]) => (
                    <div key={group}>
                      <div className="text-sm font-mono mb-1">{group}</div>
                      <div className="flex space-x-2 flex-wrap">
                        {(bases as BasisSetData[]).map((basis: BasisSetData) => (
                          <Tooltip key={basis.id} tooltip={basis.description || ""}>
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
                  ))
                ) : (
                  // If no grouped data, display all basis sets
                  <div className="flex space-x-2 flex-wrap">
                    {basisSetOptions.map(basis => (
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
                )}
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
      )}

      <NavigationFooter
        onBack={() => onNavigate('welcome')}
        onNext={handleNextNavigation}
        nextLabel="Next: Detailed Configuration"
        nextDisabled={!selectedSystem || !selectedBasis || !selectedExperimentType}
      />
    </PageLayout>
  );
}