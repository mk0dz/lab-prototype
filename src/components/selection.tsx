import React, { useState } from 'react';

interface QuantumSystemSelectionProps {
  onNavigate: (section: string) => void;
}

export default function QuantumSystemSelection({ onNavigate }: QuantumSystemSelectionProps) {
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);
  const [selectedBasis, setSelectedBasis] = useState<string | null>(null);

  return (
    <div className="min-h-screen w-full py-6 px-4 flex flex-col">
      <div className="flex justify-between items-center mb-6 border-b pb-2">
        <h2 className="text-2xl">Quantum System Selection</h2>
        <div className="text-lg">Model: 1</div>
      </div>

      {/* Main content area with flex-1 to take available space but not push buttons off screen */}
      <div className="flex flex-1 mb-6 overflow-auto">
        {/* Left Sidebar - System Options */}
        <div className="w-48 border-r pr-4">
          <h3 className="text-lg font-bold mb-4">Basic Sets:</h3>
          <div className="space-y-4">
            <button 
              className={`w-full border ${selectedSystem === 'He+1' ? 'bg-black text-white' : 'border-black'} py-2 px-4 text-left`}
              onClick={() => setSelectedSystem('He+1')}
            >
              He+1
            </button>
            <button 
              className={`w-full border ${selectedSystem === 'Li+1' ? 'bg-black text-white' : 'border-black'} py-2 px-4 text-left`}
              onClick={() => setSelectedSystem('Li+1')}
            >
              Li+1
            </button>
            <button 
              className={`w-full border ${selectedSystem === 'H2' ? 'bg-black text-white' : 'border-black'} py-2 px-4 text-left`}
              onClick={() => setSelectedSystem('H2')}
            >
              H₂
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-4 grid grid-cols-2 gap-6">
            <div 
              className={`border ${selectedSystem ? 'border-black' : 'border-gray-300'} flex items-center justify-center p-12 cursor-pointer`}
              onClick={() => selectedSystem && setSelectedSystem('Ground')}
            >
              Ground
            </div>
            <div 
              className={`border ${selectedSystem ? 'border-black' : 'border-gray-300'} flex items-center justify-center p-12 cursor-pointer`}
              onClick={() => selectedSystem && setSelectedSystem('Ex1')}
            >
              Ex 1
            </div>
            <div 
              className={`border ${selectedSystem ? 'border-black' : 'border-gray-300'} flex items-center justify-center p-12 cursor-pointer`}
              onClick={() => selectedSystem && setSelectedSystem('Ex2')}
            >
              Ex 2
            </div>
            <div 
              className={`border ${selectedSystem ? 'border-black' : 'border-gray-300'} flex items-center justify-center p-12 cursor-pointer`}
              onClick={() => selectedSystem && setSelectedSystem('Custom')}
            >
              Custom
            </div>
          </div>

          {/* Bottom Options */}
          <div className="p-4 border-t">
            <h3 className="mb-4">Basis Sets:</h3>
            <div className="flex space-x-4">
              <button 
                className={`border ${selectedBasis === 'Std3' ? 'bg-black text-white' : 'border-black'} py-2 px-4`}
                onClick={() => setSelectedBasis('Std3')}
              >
                Std 3
              </button>
              <button 
                className={`border ${selectedBasis === 'cc-PVTZ' ? 'bg-black text-white' : 'border-black'} py-2 px-4`}
                onClick={() => setSelectedBasis('cc-PVTZ')}
              >
                cc-PVTZ
              </button>
              <button 
                className={`border ${selectedBasis === 'Custom' ? 'bg-black text-white' : 'border-black'} py-2 px-4`}
                onClick={() => setSelectedBasis('Custom')}
              >
                Custom
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation buttons in a fixed position at the bottom */}
      <div className="py-4 flex justify-between sticky bottom-0 bg-white">
        <button 
          onClick={() => onNavigate('welcome')} 
          className="bg-gray-200 px-6 py-2 hover:bg-gray-300"
        >
          Back
        </button>
        <button 
          onClick={() => onNavigate('detailed-quantum')} 
          className="bg-black text-white px-6 py-2 hover:bg-gray-800"
          disabled={!selectedSystem || !selectedBasis}
          style={{ cursor: (!selectedSystem || !selectedBasis) ? 'not-allowed' : 'pointer' }}
        >
          Next: Configure Experiment
          {(!selectedSystem || !selectedBasis) && 
            <span className="block text-xs mt-1">
              {!selectedSystem ? 'Select a system' : 'Select a basis'}
            </span>
          }
        </button>
      </div>
    </div>
  );
}