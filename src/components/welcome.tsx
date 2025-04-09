import React from 'react';

interface WelcomeProps {
  onNavigate: (section: string) => void;
}

export default function Welcome({ onNavigate }: WelcomeProps) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center py-10">
      <div className="text-center mb-16">
        <h1 className="text-6xl mb-2">welcome!</h1>
        <h2 className="text-4xl mb-2">it's Dirac's lab-prototype</h2>
        <p className="text-xl">try playing with quantum systems here</p>
      </div>

      <div className="max-w-2xl w-full px-4 space-y-4 mb-12">
        <p className="text-lg">Step1 : Quantum System Selection & System Visualization (Atoms, Molecules & Particles)</p>
        <p className="text-lg">Step2 : Experiment Configuration (Ansatz, Mapper, Hamiltonian, etc.)</p>
        <p className="text-lg">Step3 : Anylyzing Results (Graphs + Interpretation)</p>
        <p className="text-lg">Step4 : Sharing & Blockchain Publishing </p>
      </div>

      <button 
        onClick={() => onNavigate('quantum-system')} 
        className="bg-black text-white px-8 py-3 text-lg"
      >
        Define Quantum system
      </button>
    </div>
  );
}