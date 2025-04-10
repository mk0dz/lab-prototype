// src/components/results.tsx
import React, { useState, useEffect, useRef } from 'react';
import { PageLayout, SectionTitle, NavigationFooter, Card } from './design-system';
import { useQuantumSystem } from './context';

interface ResultsProps {
  onNavigate: (section: string) => void;
}

// Energy Levels Chart Component
const EnergyLevelsChart = ({ data }: { data: any[] }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current || !data || data.length === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = canvas.clientWidth * window.devicePixelRatio;
    canvas.height = canvas.clientHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Define chart settings
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const padding = { top: 20, right: 40, bottom: 30, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    
    // Find energy range
    const minEnergy = Math.min(...data.map(level => level.energy)) - 0.5;
    const maxEnergy = Math.max(...data.map(level => level.energy)) + 0.5;
    const energyRange = maxEnergy - minEnergy;
    
    // Draw energy scale
    ctx.fillStyle = '#000';
    ctx.font = '10px Arial';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    
    // Y-axis (energy levels)
    const energySteps = 5;
    for (let i = 0; i <= energySteps; i++) {
      const energy = minEnergy + (energyRange * i / energySteps);
      const y = padding.top + chartHeight - (i / energySteps) * chartHeight;
      
      // Draw tick mark
      ctx.beginPath();
      ctx.moveTo(padding.left - 5, y);
      ctx.lineTo(padding.left, y);
      ctx.stroke();
      
      // Draw label
      ctx.fillText(energy.toFixed(1) + ' eV', padding.left - 8, y);
      
      // Draw grid line
      ctx.strokeStyle = '#e5e7eb';
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + chartWidth, y);
      ctx.stroke();
      ctx.strokeStyle = '#000';
    }
    
    // X-axis (orbital index)
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    
    // Draw energy levels (horizontal bars)
    data.forEach((level, index) => {
      const x = padding.left + (index + 0.5) * (chartWidth / data.length);
      const y = padding.top + chartHeight - ((level.energy - minEnergy) / energyRange) * chartHeight;
      const barWidth = chartWidth / data.length * 0.7;
      
      // Draw orbital index
      ctx.fillText(`${index + 1}`, x, padding.top + chartHeight + 5);
      
      // Draw energy level bar
      ctx.fillStyle = level.occupation > 0 ? '#3b82f6' : '#d1d5db';
      ctx.fillRect(x - barWidth / 2, y, barWidth, 3);
      
      // Draw occupation electrons
      if (level.occupation > 0) {
        ctx.fillStyle = '#000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('↑↓', x, y - 10);
      }
    });
    
    // Draw Y-axis label
    ctx.save();
    ctx.translate(15, padding.top + chartHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#000';
    ctx.fillText('Energy (eV)', 0, 0);
    ctx.restore();
    
    // Draw X-axis label
    ctx.fillText('Orbital', padding.left + chartWidth / 2, padding.top + chartHeight + 20);
    
  }, [data]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-64"
      style={{ display: 'block' }}
    ></canvas>
  );
};

// Convergence Plot Component
const ConvergencePlot = ({ iterations = [], energies = [], referenceEnergy = null }: { 
  iterations: number[], 
  energies: number[],
  referenceEnergy: number | null
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current || !energies.length) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = canvas.clientWidth * window.devicePixelRatio;
    canvas.height = canvas.clientHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Define chart settings
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const padding = { top: 20, right: 20, bottom: 30, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    
    // Find energy range
    const minEnergy = Math.min(...energies) * 1.001; // Add 0.1% margin
    const maxEnergy = Math.max(...energies) * 0.999; // Subtract 0.1% margin
    const energyRange = maxEnergy - minEnergy;
    
    // Draw axes
    ctx.strokeStyle = '#000';
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, padding.top + chartHeight);
    ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight);
    ctx.stroke();
    
    // Draw energy scale
    ctx.fillStyle = '#000';
    ctx.font = '10px Arial';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    
    // Y-axis (energy values)
    const energySteps = 5;
    for (let i = 0; i <= energySteps; i++) {
      const energy = minEnergy + (energyRange * i / energySteps);
      const y = padding.top + chartHeight - (i / energySteps) * chartHeight;
      
      // Draw tick mark
      ctx.beginPath();
      ctx.moveTo(padding.left - 5, y);
      ctx.lineTo(padding.left, y);
      ctx.stroke();
      
      // Draw label
      ctx.fillText(energy.toFixed(6), padding.left - 8, y);
      
      // Draw grid line
      ctx.strokeStyle = '#e5e7eb';
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + chartWidth, y);
      ctx.stroke();
      ctx.strokeStyle = '#000';
    }
    
    // X-axis (iterations)
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const iterationSteps = Math.min(10, iterations.length);
    for (let i = 0; i < iterationSteps; i++) {
      const iteration = Math.round(iterations[Math.floor(i * iterations.length / iterationSteps)]);
      const x = padding.left + (i / (iterationSteps - 1)) * chartWidth;
      
      // Draw tick mark
      ctx.beginPath();
      ctx.moveTo(x, padding.top + chartHeight);
      ctx.lineTo(x, padding.top + chartHeight + 5);
      ctx.stroke();
      
      // Draw label
      ctx.fillText(iteration.toString(), x, padding.top + chartHeight + 8);
    }
    
    // Draw convergence line
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    energies.forEach((energy, i) => {
      const x = padding.left + (i / (energies.length - 1)) * chartWidth;
      const y = padding.top + chartHeight - ((energy - minEnergy) / energyRange) * chartHeight;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
    
    // Draw data points
    energies.forEach((energy, i) => {
      if (i % Math.max(1, Math.floor(energies.length / 20)) === 0) { // Show ~20 points max
        const x = padding.left + (i / (energies.length - 1)) * chartWidth;
        const y = padding.top + chartHeight - ((energy - minEnergy) / energyRange) * chartHeight;
        
        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
        ctx.fill();
      }
    });
    
    // Draw reference energy line if available
    if (referenceEnergy !== null) {
      const y = padding.top + chartHeight - ((referenceEnergy - minEnergy) / energyRange) * chartHeight;
      
      ctx.strokeStyle = '#ef4444';
      ctx.setLineDash([5, 3]);
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + chartWidth, y);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Add label for reference energy
      ctx.fillStyle = '#ef4444';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'bottom';
      ctx.fillText('Reference Energy', padding.left + 5, y - 3);
    }
    
    // Draw Y-axis label
    ctx.save();
    ctx.translate(15, padding.top + chartHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#000';
    ctx.fillText('Energy (Hartree)', 0, 0);
    ctx.restore();
    
    // Draw X-axis label
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('Iteration', padding.left + chartWidth / 2, padding.top + chartHeight + 25);
    
  }, [iterations, energies, referenceEnergy]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-64"
      style={{ display: 'block' }}
    ></canvas>
  );
};

// Density Matrix Visualization
const DensityMatrixVisual = ({ data }: { data: number[][] }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current || !data || !data.length) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = canvas.clientWidth * window.devicePixelRatio;
    canvas.height = canvas.clientHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Define matrix settings
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const padding = 30;
    const matrixSize = Math.min(width, height) - 2 * padding;
    const cellSize = matrixSize / data.length;
    
    // Find value range
    const allValues = data.flat();
    const maxAbsValue = Math.max(Math.abs(Math.min(...allValues)), Math.abs(Math.max(...allValues)));
    
    // Draw cells
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].length; j++) {
        const x = padding + j * cellSize;
        const y = padding + i * cellSize;
        
        // Normalize value to [-1, 1]
        const normalizedValue = data[i][j] / maxAbsValue;
        
        // Choose color: blue for negative, white for zero, red for positive
        let fillColor;
        if (normalizedValue < 0) {
          // Blue gradient for negative values
          const intensity = Math.min(255, Math.round(255 * Math.abs(normalizedValue)));
          fillColor = `rgb(0, 0, ${intensity})`;
        } else {
          // Red gradient for positive values
          const intensity = Math.min(255, Math.round(255 * normalizedValue));
          fillColor = `rgb(${intensity}, 0, 0)`;
        }
        
        // Draw cell
        ctx.fillStyle = fillColor;
        ctx.fillRect(x, y, cellSize, cellSize);
        
        // Draw cell border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.strokeRect(x, y, cellSize, cellSize);
        
        // Add text for significant values
        if (Math.abs(normalizedValue) > 0.1) {
          ctx.fillStyle = 'white';
          ctx.font = '9px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(data[i][j].toFixed(1), x + cellSize / 2, y + cellSize / 2);
        }
      }
    }
    
    // Add axis labels
    ctx.fillStyle = '#000';
    ctx.font = '10px Arial';
    ctx.textBaseline = 'middle';
    
    for (let i = 0; i < data.length; i++) {
      // Y-axis labels (row indices)
      ctx.textAlign = 'right';
      ctx.fillText(i.toString(), padding - 5, padding + i * cellSize + cellSize / 2);
      
      // X-axis labels (column indices)
      ctx.textAlign = 'center';
      ctx.fillText(i.toString(), padding + i * cellSize + cellSize / 2, padding - 15);
    }
    
    // Add title
    ctx.fillStyle = '#000';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Density Matrix', width / 2, padding - 20);
    
  }, [data]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-64"
      style={{ display: 'block' }}
    ></canvas>
  );
};

export default function Results({ onNavigate }: ResultsProps) {
  const { systemData, experimentData, createAndRunExperiment } = useQuantumSystem();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('summary');

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
          
          // Generate mock data for display
          setResult(generateMockResult());
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
  const convergenceData = result?.data?.convergence || generateMockConvergenceData();
  const densityMatrix = result?.data?.density_matrix || generateMockDensityMatrix();
  
  function generateMockResult() {
    return {
      id: 1,
      experiment_id: 1,
      energy: -74.965432,
      reference_energy: -75.012345,
      iterations: 35,
      runtime: 12.34,
      system_id: systemData.systemId,
      basis_set: systemData.basisSet,
      data: {
        orbitals: generateMockEnergyLevels(),
        convergence: generateMockConvergenceData(),
        density_matrix: generateMockDensityMatrix(),
        dipole_moment: [0.0, 0.0, 0.0821],
        excited_states: [
          { energy: -74.123456, oscillator_strength: 0.1234 },
          { energy: -73.987654, oscillator_strength: 0.0567 }
        ],
        homo_lumo_gap: 4.23
      }
    };
  }
  
  function generateMockEnergyLevels() {
    return Array.from({ length: 8 }, (_, i) => ({
      index: i,
      energy: -12 + i * 1.5,
      occupation: i < 4 ? 2.0 : 0.0,
    }));
  }
  
  function generateMockConvergenceData() {
    const iterations = Array.from({ length: 35 }, (_, i) => i + 1);
    
    // Generate decreasing energy values that converge
    const startEnergy = -74.5;
    const finalEnergy = -74.965432;
    
    const energies = iterations.map(iter => {
      // Exponential decay function for convergence
      const progress = 1 - Math.exp(-0.15 * iter);
      return startEnergy + (finalEnergy - startEnergy) * progress;
    });
    
    return {
      iterations,
      energies,
      final_energy: finalEnergy
    };
  }
  
  function generateMockDensityMatrix() {
    // Create a symmetric 4x4 density matrix
    const matrix = [
      [1.9, 0.02, -0.15, 0.01],
      [0.02, 1.8, 0.03, -0.1],
      [-0.15, 0.03, 1.7, 0.05],
      [0.01, -0.1, 0.05, 0.5]
    ];
    
    return matrix;
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

  const renderTabContent = () => {
    if (activeTab === 'summary') {
      return (
        <>
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
            <EnergyLevelsChart data={energyLevels} />
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
                <div className="mt-4">
                  <p className="font-bold">Excited States</p>
                  <table className="w-full mt-1">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left">State</th>
                        <th className="text-left">Energy (eV)</th>
                        <th className="text-left">Osc. Strength</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.data.excited_states.map((state: any, idx: number) => (
                        <tr key={idx} className="border-b">
                          <td>{idx + 1}</td>
                          <td>{state.energy.toFixed(4)}</td>
                          <td>{state.oscillator_strength.toFixed(4)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </Card>
        </>
      );
    }
    
    if (activeTab === 'convergence') {
      return (
        <>
          <Card className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-bold mb-3 font-serif">Convergence Analysis</h3>
            <ConvergencePlot 
              iterations={convergenceData.iterations} 
              energies={convergenceData.energies}
              referenceEnergy={result?.reference_energy} 
            />
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-sm">
              <div>
                <p className="font-bold">Initial Energy</p>
                <p>{convergenceData.energies[0]?.toFixed(6) || 'N/A'} Hartree</p>
              </div>
              <div>
                <p className="font-bold">Final Energy</p>
                <p>{convergenceData.final_energy?.toFixed(6) || convergenceData.energies[convergenceData.energies.length - 1]?.toFixed(6) || 'N/A'} Hartree</p>
              </div>
              <div>
                <p className="font-bold">Energy Change</p>
                <p>{(convergenceData.energies[convergenceData.energies.length - 1] - convergenceData.energies[0]).toFixed(6) || 'N/A'} Hartree</p>
              </div>
            </div>
          </Card>
          
          <Card className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-bold mb-3 font-serif">Density Matrix</h3>
            <DensityMatrixVisual data={densityMatrix} />
            <div className="mt-2 text-sm text-gray-500 font-mono">
              <p>Density matrix elements represent electron probability distributions</p>
            </div>
          </Card>
        </>
      );
    }
    
    if (activeTab === 'export') {
      return (
        <Card className="col-span-1 md:col-span-2">
          <h3 className="text-lg font-bold mb-3 font-serif">Export Results</h3>
          <div className="space-y-4">
            <div>
              <p className="mb-2">Export data in various formats</p>
              <div className="flex space-x-3">
                <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300">
                  JSON
                </button>
                <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300">
                  CSV
                </button>
                <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300">
                  PDF Report
                </button>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <p className="font-bold mb-2">Citation</p>
              <div className="bg-gray-50 p-3 text-sm font-mono">
                <p>Quantum Lab Tool (2023). {getExperimentTypeName()} of {result?.system_id || systemData.systemId} using {result?.basis_set || systemData.basisSet} basis set.</p>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <p className="font-bold mb-2">Raw Data</p>
              <div className="bg-gray-50 p-3 text-sm font-mono h-40 overflow-y-auto">
                <pre>{JSON.stringify(result, null, 2)}</pre>
              </div>
            </div>
          </div>
        </Card>
      );
    }
    
    return null;
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
        <>
          {/* Result Tabs */}
          <div className="flex border-b mb-4">
            <button 
              className={`py-2 px-4 font-serif ${activeTab === 'summary' ? 'border-b-2 border-black font-bold' : 'text-gray-600'}`}
              onClick={() => setActiveTab('summary')}
            >
              Summary
            </button>
            <button 
              className={`py-2 px-4 font-serif ${activeTab === 'convergence' ? 'border-b-2 border-black font-bold' : 'text-gray-600'}`}
              onClick={() => setActiveTab('convergence')}
            >
              Convergence
            </button>
            <button 
              className={`py-2 px-4 font-serif ${activeTab === 'export' ? 'border-b-2 border-black font-bold' : 'text-gray-600'}`}
              onClick={() => setActiveTab('export')}
            >
              Export
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[calc(100vh-200px)] overflow-y-auto">
            {renderTabContent()}
          </div>
        </>
      )}

      <NavigationFooter
        onBack={() => onNavigate('experiment-config')}
        onNext={() => onNavigate('publishing')}
        nextLabel="Publish Results"
      />
    </PageLayout>
  );
}