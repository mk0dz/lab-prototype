// src/components/results.tsx
import React, { useState, useEffect } from 'react';
import { PageLayout, SectionTitle, NavigationFooter, Card } from './design-system';
import { useQuantumSystem } from './context';

interface ResultsProps {
  onNavigate: (section: string) => void;
}

export default function Results({ onNavigate }: ResultsProps) {
  const { systemData, experimentData, createAndRunExperiment } = useQuantumSystem();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const runExperiment = async () => {
      if (!result && !isLoading && !experimentData.experimentResults.length) {
        setIsLoading(true);
        setError(null);
        try {
          const experimentResult = await createAndRunExperiment();
          setResult(experimentResult);
        } catch (err) {
          console.error('Error running experiment:', err);
          setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
          setIsLoading(false);
        }
      } else if (experimentData.experimentResults.length > 0 && !result) {
        // Use the latest result if we don't have one yet
        setResult(experimentData.experimentResults[experimentData.experimentResults.length - 1]);
      }
    };

    runExperiment();
    // Only include stable references and values that won't change with every render
  }, [createAndRunExperiment, experimentData.experimentResults.length]);

  // Generate mock data for energy levels display
  const energyLevels = result?.data?.orbitals || generateMockEnergyLevels();
  
  function generateMockEnergyLevels() {
    return Array.from({ length: 8 }, (_, i) => ({
      index: i,
      energy: -12 + i * 1.5,
      occupation: i < 4 ? 2.0 : 0.0,
    }));
  }

  const getExperimentTypeName = () => {
    switch (systemData.experimentType) {
      case 'ground':
        return 'Ground State Calculation';
      case 'excited':
        return 'Excited State Calculation';
      case 'geometry':
        return 'Geometry Optimization';
      case 'vibrational':
        return 'Vibrational Analysis';
      case 'dipole':
        return 'Dipole Moment Calculation';
      default:
        return 'Quantum Calculation';
    }
  };

  return (
    <PageLayout>
      <SectionTitle 
        title="Experiment Results" 
        subtitle="Step 4/4" 
      />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-full space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          <p className="text-lg font-mono">Running quantum calculation...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-full space-y-4">
          <div className="bg-red-100 text-red-700 p-4 rounded-md max-w-md text-center">
            <p className="font-bold">Error Running Experiment</p>
            <p>{error}</p>
            <p className="mt-2">Using mock data for display purposes.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[calc(100vh-200px)] overflow-y-auto">
          {/* Results Summary Card */}
          <Card className="col-span-1 md:col-span-2">
            <h2 className="text-xl font-bold mb-3 font-serif">
              {getExperimentTypeName()} Results
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left column - Key results */}
              <div className="space-y-2">
                <div className="font-mono">
                  <p className="text-sm text-gray-500">System</p>
                  <p className="font-bold">{result?.system_id || systemData.systemId}</p>
                </div>
                
                <div className="font-mono">
                  <p className="text-sm text-gray-500">Basis Set</p>
                  <p className="font-bold">{result?.basis_set || systemData.basisSet}</p>
                </div>
                
                <div className="font-mono">
                  <p className="text-sm text-gray-500">Energy</p>
                  <p className="font-bold">{result?.energy ? `${result.energy.toFixed(6)} Hartree` : 'Not available'}</p>
                </div>
                
                {result?.reference_energy && (
                  <div className="font-mono">
                    <p className="text-sm text-gray-500">Reference Energy</p>
                    <p className="font-bold">{result.reference_energy.toFixed(6)} Hartree</p>
                  </div>
                )}
              </div>
              
              {/* Right column - Performance metrics */}
              <div className="space-y-2">
                <div className="font-mono">
                  <p className="text-sm text-gray-500">Calculation Method</p>
                  <p className="font-bold">{result?.method || 'Quantum VQE'}</p>
                </div>
                
                <div className="font-mono">
                  <p className="text-sm text-gray-500">Iterations</p>
                  <p className="font-bold">{result?.iterations || 'N/A'}</p>
                </div>
                
                <div className="font-mono">
                  <p className="text-sm text-gray-500">Runtime</p>
                  <p className="font-bold">{result?.runtime ? `${result.runtime.toFixed(2)} seconds` : 'N/A'}</p>
                </div>
                
                <div className="font-mono">
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-bold text-green-600">
                    {result?.converged === false ? 'Failed to converge' : 'Success'}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        
          {/* Molecular Orbitals Card */}
          <Card className="overflow-hidden">
            <h3 className="text-lg font-bold mb-3 font-serif">Energy Levels</h3>
            <div className="relative h-64">
              {/* Energy scale */}
              <div className="absolute left-0 top-0 bottom-0 w-12 border-r flex flex-col justify-between text-xs font-mono p-1">
                <span>-8 eV</span>
                <span>-12 eV</span>
                <span>-16 eV</span>
              </div>
              
              {/* Energy levels display */}
              <div className="absolute left-12 right-0 top-0 bottom-0">
                {energyLevels.map((level: any, index: number) => (
                  <div 
                    key={index}
                    className={`absolute h-2 left-0 right-0 ${level.occupation > 0 ? 'bg-blue-500' : 'bg-gray-300'}`}
                    style={{ 
                      top: `${((level.energy + 16) / 8) * 100}%`,
                      width: '80%'
                    }}
                  >
                    <span className="absolute right-full mr-1 text-xs font-mono">
                      {index + 1}
                    </span>
                    <span className="absolute left-full ml-1 text-xs font-mono">
                      {level.occupation > 0 ? `↑↓` : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-2 text-sm font-mono text-gray-500">
              <p>HOMO-LUMO Gap: {result?.data?.homo_lumo_gap || '4.23'} eV</p>
            </div>
          </Card>
          
          {/* Additional Properties Card */}
          <Card>
            <h3 className="text-lg font-bold mb-3 font-serif">Properties</h3>
            <div className="space-y-2 font-mono text-sm">
              {result?.data?.dipole_moment && (
                <div>
                  <p className="font-bold">Dipole Moment</p>
                  <p>x: {result.data.dipole_moment[0]?.toFixed(4) || '0.0000'} Debye</p>
                  <p>y: {result.data.dipole_moment[1]?.toFixed(4) || '0.0000'} Debye</p>
                  <p>z: {result.data.dipole_moment[2]?.toFixed(4) || '0.0821'} Debye</p>
                </div>
              )}
              
              {/* Show excited states if available */}
              {result?.data?.excited_states && (
                <div className="mt-3">
                  <p className="font-bold">Excited States</p>
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left">State</th>
                        <th className="text-left">Energy (eV)</th>
                        <th className="text-left">Strength</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.data.excited_states.map((state: any, i: number) => (
                        <tr key={i} className="border-b">
                          <td>{i+1}</td>
                          <td>{state.excitation_energy_ev?.toFixed(4) || '0.0000'}</td>
                          <td>{state.oscillator_strength?.toFixed(4) || '0.0000'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              {/* Show geometry if available */}
              {result?.data?.optimized_geometry && (
                <div className="mt-3">
                  <p className="font-bold">Optimized Geometry</p>
                  <p className="text-xs text-gray-500">Final coordinates (Å)</p>
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left">Atom</th>
                        <th className="text-left">X</th>
                        <th className="text-left">Y</th>
                        <th className="text-left">Z</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.data.optimized_geometry.atoms.map((atom: any, i: number) => (
                        <tr key={i} className="border-b">
                          <td>{atom.symbol}</td>
                          <td>{atom.x.toFixed(4)}</td>
                          <td>{atom.y.toFixed(4)}</td>
                          <td>{atom.z.toFixed(4)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              {!result?.data?.dipole_moment && !result?.data?.excited_states && !result?.data?.optimized_geometry && (
                <div>
                  <p>Ionization Energy: 13.6 eV</p>
                  <p>Electron Affinity: 3.2 eV</p>
                  <p>Bond Length: 0.74 Å</p>
                  <p>Bond Angle: 104.5°</p>
                </div>
              )}
            </div>
          </Card>
          
          {/* Raw Data Card */}
          <Card className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-bold mb-3 font-serif">Raw Data</h3>
            <div className="w-full h-48 bg-gray-100 p-2 overflow-auto rounded">
              <pre className="text-xs font-mono">
                {result ? JSON.stringify(result, null, 2) : 'No data available'}
              </pre>
            </div>
          </Card>
        </div>
      )}

      <NavigationFooter
        onBack={() => onNavigate('experiment-config')}
        onNext={() => onNavigate('publishing')}
        nextLabel="Continue to Publishing"
      />
    </PageLayout>
  );
}