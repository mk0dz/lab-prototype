import React, { useState } from 'react';

interface ExperimentConfigProps {
  onNavigate: (section: string) => void;
}

export default function ExperimentConfig({ onNavigate }: ExperimentConfigProps) {
  const [selectedAnsatz, setSelectedAnsatz] = useState<string | null>(null);
  const [selectedMapper, setSelectedMapper] = useState<string | null>(null);
  const [selectedHamiltonian, setSelectedHamiltonian] = useState<string | null>(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string | null>(null);

  return (
    <div className="min-h-screen w-full py-6 px-4">
      <div className="flex justify-between items-center mb-8 border-b pb-2">
        <h2 className="text-2xl">Experiment Configurator</h2>
        <div className="text-lg">Model: 1</div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Ansatz Section */}
        <div>
          <h3 className="text-xl mb-4">Ansatz</h3>
          <div className="grid grid-cols-3 gap-4">
            <button 
              className={`border ${selectedAnsatz === '1' ? 'bg-black text-white' : 'border-black'} p-4`}
              onClick={() => setSelectedAnsatz('1')}
            >
              1
            </button>
            <button 
              className={`border ${selectedAnsatz === '2' ? 'bg-black text-white' : 'border-black'} p-4`}
              onClick={() => setSelectedAnsatz('2')}
            >
              2
            </button>
            <button 
              className={`border ${selectedAnsatz === '3' ? 'bg-black text-white' : 'border-black'} p-4`}
              onClick={() => setSelectedAnsatz('3')}
            >
              Custom
            </button>
          </div>
        </div>

        {/* Mapper Section */}
        <div>
          <h3 className="text-xl mb-4">Mapper</h3>
          <div className="grid grid-cols-4 gap-4">
            <button 
              className={`border ${selectedMapper === '1' ? 'bg-black text-white' : 'border-black'} p-4`}
              onClick={() => setSelectedMapper('1')}
            >
              1
            </button>
            <button 
              className={`border ${selectedMapper === '2' ? 'bg-black text-white' : 'border-black'} p-4`}
              onClick={() => setSelectedMapper('2')}
            >
              2
            </button>
            <button 
              className={`border ${selectedMapper === '3' ? 'bg-black text-white' : 'border-black'} p-4`}
              onClick={() => setSelectedMapper('3')}
            >
              3
            </button>
            <button 
              className={`border ${selectedMapper === 'custom' ? 'bg-black text-white' : 'border-black'} p-4`}
              onClick={() => setSelectedMapper('custom')}
            >
              Custom
            </button>
          </div>
        </div>

        {/* Hamiltonian Section */}
        <div>
          <h3 className="text-xl mb-4">Hamiltonian</h3>
          <div className="grid grid-cols-2 gap-4">
            <button 
              className={`border ${selectedHamiltonian === 'Pauli' ? 'bg-black text-white' : 'border-black'} p-4`}
              onClick={() => setSelectedHamiltonian('Pauli')}
            >
              Pauli
            </button>
            <button 
              className={`border ${selectedHamiltonian === 'Custom' ? 'bg-black text-white' : 'border-black'} p-4`}
              onClick={() => setSelectedHamiltonian('Custom')}
            >
              Custom
            </button>
          </div>
        </div>

        {/* Algorithm Section */}
        <div>
          <h3 className="text-xl mb-4">Algorithm</h3>
          <div className="grid grid-cols-3 gap-4">
            <button 
              className={`border ${selectedAlgorithm === 'VQE' ? 'bg-black text-white' : 'border-black'} p-4`}
              onClick={() => setSelectedAlgorithm('VQE')}
            >
              VQE
            </button>
            <button 
              className={`border ${selectedAlgorithm === 'QPE' ? 'bg-black text-white' : 'border-black'} p-4`}
              onClick={() => setSelectedAlgorithm('QPE')}
            >
              QPE
            </button>
            <button 
              className={`border ${selectedAlgorithm === '3' ? 'bg-black text-white' : 'border-black'} p-4`}
              onClick={() => setSelectedAlgorithm('3')}
            >
              3
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <button 
              className={`border ${selectedAlgorithm === '4' ? 'bg-black text-white' : 'border-black'} p-4`}
              onClick={() => setSelectedAlgorithm('4')}
            >
              4
            </button>
            <button 
              className={`border ${selectedAlgorithm === '5' ? 'bg-black text-white' : 'border-black'} p-4`}
              onClick={() => setSelectedAlgorithm('5')}
            >
              5
            </button>
            <button 
              className={`border ${selectedAlgorithm === 'Custom' ? 'bg-black text-white' : 'border-black'} p-4`}
              onClick={() => setSelectedAlgorithm('Custom')}
            >
              Custom
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <button 
          onClick={() => onNavigate('detailed-quantum')} 
          className="bg-gray-200 px-6 py-2"
        >
          Back
        </button>
        <button 
          onClick={() => onNavigate('results')} 
          className="bg-black text-white px-6 py-2"
          disabled={!selectedAnsatz || !selectedMapper || !selectedHamiltonian || !selectedAlgorithm}
        >
          Run Experiment
        </button>
      </div>
    </div>
  );
}