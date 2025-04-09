import React, { useState } from 'react';
import QuantumVisualization from './visualization';

interface DetailedQuantumSelectionProps {
  onNavigate: (section: string) => void;
}

export default function DetailedQuantumSelection({ onNavigate }: DetailedQuantumSelectionProps) {
  const [selectedSystem, setSelectedSystem] = useState<string>('');

  return (
    <div className="min-h-screen w-full py-6 px-4">
      <div className="flex justify-between items-center mb-8 border-b pb-2">
        <h2 className="text-2xl">Select Quantum Systems</h2>
        <div className="text-lg">Level: 2</div>
      </div>

      <div className="mb-4">
        <h3 className="text-xl mb-4">He+1</h3>
        <div className="flex justify-between gap-6 mb-8">
          <div className="w-1/3 border border-black rounded-sm p-4 flex items-center justify-center" 
               onClick={() => setSelectedSystem('H')}>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full border border-black"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-black"></div>
                </div>
              </div>
              <div>H</div>
            </div>
          </div>
          
          <div className="w-1/3 border border-black rounded-sm p-4 flex items-center justify-center"
               onClick={() => setSelectedSystem('He')}>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full border border-black"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-black"></div>
                  <div className="absolute top-[40%] left-[60%] w-2 h-2 rounded-full bg-blue-500"></div>
                  <div className="absolute top-[60%] left-[40%] w-2 h-2 rounded-full bg-blue-500"></div>
                </div>
              </div>
              <div>He</div>
            </div>
          </div>
          
          <div className="w-1/3 border border-black rounded-sm p-4 flex items-center justify-center"
               onClick={() => setSelectedSystem('molecule')}>
            <div className="text-center">
              <div>Molecular Stack</div>
              <div className="flex justify-center mt-2">
                <div className="relative flex items-center">
                  <div className="w-10 h-10 rounded-full border border-black"></div>
                  <div className="w-12 h-1 bg-black"></div>
                  <div className="w-10 h-10 rounded-full border border-black"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border border-black p-6 mb-8">
        <h3 className="text-xl mb-4">Quantum System Information Here</h3>
        <QuantumVisualization systemType={selectedSystem} />
      </div>
      
      <div className="mt-4 flex justify-between">
        <button 
          onClick={() => onNavigate('quantum-system')} 
          className="bg-gray-200 px-6 py-2"
        >
          Back
        </button>
        <button 
          onClick={() => onNavigate('experiment-config')} 
          className="bg-black text-white px-6 py-2"
          disabled={!selectedSystem}
        >
          Next: Configure Experiment
        </button>
      </div>
    </div>
  );
}