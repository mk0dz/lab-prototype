// src/components/welcome.tsx
import React from 'react';
import { Button, PageLayout } from './design-system';

interface WelcomeProps {
  onNavigate: (section: string) => void;
}

export default function Welcome({ onNavigate }: WelcomeProps) {
  return (
    <PageLayout>
      <div className="h-screen flex flex-col items-center">
        {/* Header */}
        <div className="text-center my-8 border-b border-gray-200 pb-2 w-3/4 max-w-xl">
          <h1 className="text-4xl mb-1 font-serif font-bold">Dirac's Lab</h1>
          <h2 className="text-xl mb-1 font-serif text-gray-700">Quantum Computing Simulator</h2>
          <p className="text-sm mb-3">Explore quantum systems and run experiments in this interactive environment</p>
        </div>
        
        <div className="flex w-full max-w-4xl justify-between px-8" style={{ height: 'calc(100vh - 180px)' }}>
          {/* Left: Steps Area */}
          <div className="w-full md:w-1/2 flex flex-col justify-center space-y-4 pr-4">
            <div className="border-2 border-black p-3 rounded-md shadow-sm">
              <div className="text-base font-bold">Step 1:</div>
              <p className="text-sm">Quantum System Selection & Visualization (Atoms, Molecules & Particles)</p>
            </div>
            
            <div className="border-2 border-black p-3 rounded-md shadow-sm">
              <div className="text-base font-bold">Step 2:</div>
              <p className="text-sm">Experiment Configuration (Ansatz, Mapper, Hamiltonian, etc.)</p>
            </div>
            
            <div className="border-2 border-black p-3 rounded-md shadow-sm">
              <div className="text-base font-bold">Step 3:</div>
              <p className="text-sm">Analyzing Results (Graphs + Interpretation)</p>
            </div>
            
            <div className="border-2 border-black p-3 rounded-md shadow-sm">
              <div className="text-base font-bold">Step 4:</div>
              <p className="text-sm">Sharing & Blockchain Publishing</p>
            </div>
          </div>
          
          {/* Right: Quantum Symbol Animation + Button */}
          <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
            <div className="relative w-36 h-36 border-2 border-black rounded-full mb-8">
              <div className="absolute w-6 h-6 bg-black rounded-full" style={{ top: '50%', left: '25%', transform: 'translate(-50%, -50%)' }}></div>
              <div className="absolute w-6 h-6 bg-black rounded-full" style={{ top: '50%', left: '75%', transform: 'translate(-50%, -50%)' }}></div>
              <div className="absolute h-2 bg-black" style={{ width: '50%', top: '50%', left: '25%', transform: 'translateY(-50%)' }}></div>
            </div>
            
            <Button 
              onClick={() => onNavigate('quantum-system')} 
              className="text-base px-6 py-2 bg-black text-white mb-8"
            >
              Begin Experiment
            </Button>
            
            <div className="text-xs text-gray-500 max-w-xs text-center">
              <p>This digital lab allows scientists and enthusiasts to experiment with quantum systems including antimatter simulation.</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}