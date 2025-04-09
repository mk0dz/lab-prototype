// src/components/results.tsx
import React, { useState } from 'react';
import { PageLayout, SectionTitle, Card, Button, NavigationFooter } from './design-system';

interface ResultsProps {
  onNavigate: (section: string) => void;
}

export default function Results({ onNavigate }: ResultsProps) {
  // Simulated experiment results
  const experimentResults = {
    name: "Hydrogen Molecule (H₂)",
    date: new Date().toISOString().split('T')[0],
    configuration: {
      ansatz: "UCCSD",
      mapper: "Jordan-Wigner",
      hamiltonian: "Electronic Structure",
      algorithm: "VQE"
    },
    energy: {
      ground: -1.137,
      reference: -1.1372,
      units: "Hartree"
    },
    iterations: 42,
    runtime: "2.3 seconds",
    convergence: "1.2e-5"
  };

  return (
    <PageLayout>
      <SectionTitle 
        title="Experiment Results" 
        subtitle="Step 4/5"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Results Summary */}
        <Card>
          <h3 className="text-xl font-serif mb-4">Experiment Summary</h3>
          
          <div className="space-y-3 font-mono">
            <div className="grid grid-cols-2 gap-2 border-b border-black pb-2">
              <div className="font-bold">System:</div>
              <div>{experimentResults.name}</div>
              
              <div className="font-bold">Date:</div>
              <div>{experimentResults.date}</div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 border-b border-black pb-2">
              <div className="font-bold">Ansatz:</div>
              <div>{experimentResults.configuration.ansatz}</div>
              
              <div className="font-bold">Mapper:</div>
              <div>{experimentResults.configuration.mapper}</div>
              
              <div className="font-bold">Hamiltonian:</div>
              <div>{experimentResults.configuration.hamiltonian}</div>
              
              <div className="font-bold">Algorithm:</div>
              <div>{experimentResults.configuration.algorithm}</div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="font-bold">Iterations:</div>
              <div>{experimentResults.iterations}</div>
              
              <div className="font-bold">Runtime:</div>
              <div>{experimentResults.runtime}</div>
              
              <div className="font-bold">Convergence:</div>
              <div>{experimentResults.convergence}</div>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="text-lg font-serif mb-3">Abstract</h4>
            <div className="border border-black p-3 bg-gray-50 text-sm">
              <p>
                This experiment simulated the ground state energy of a hydrogen molecule (H₂) 
                using the Variational Quantum Eigensolver (VQE) algorithm with a UCCSD ansatz. 
                The calculation achieved an energy of {experimentResults.energy.ground} {experimentResults.energy.units}, 
                which is within {Math.abs((experimentResults.energy.ground - experimentResults.energy.reference) / experimentResults.energy.reference * 100).toFixed(3)}% 
                of the reference value.
              </p>
            </div>
          </div>
        </Card>
        
        {/* Results Visualization */}
        <Card>
          <h3 className="text-xl font-serif mb-4">Energy Results</h3>
          
          <div className="border border-black bg-gray-50 h-64 flex items-center justify-center mb-4">
            {/* Energy diagram placeholder */}
            <div className="w-full h-full flex flex-col items-center justify-center relative p-6">
              <div className="absolute left-12 top-0 bottom-0 w-px bg-black"></div>
              <div className="absolute left-0 right-0 bottom-12 h-px bg-black"></div>
              
              {/* Energy level marker */}
              <div className="absolute" style={{ left: '80px', bottom: '90px' }}>
                <div className="w-32 h-px bg-black"></div>
                <div className="text-xs font-mono mt-1">Ground state: {experimentResults.energy.ground} Ha</div>
              </div>
              
              {/* Reference energy marker */}
              <div className="absolute" style={{ left: '80px', bottom: '110px' }}>
                <div className="w-32 h-px bg-gray-600"></div>
                <div className="text-xs font-mono mt-1">Reference: {experimentResults.energy.reference} Ha</div>
              </div>
              
              <div className="absolute text-xs font-mono left-2 bottom-12 transform -rotate-90 origin-bottom-left">
                Energy (Hartree)
              </div>
              <div className="absolute text-xs font-mono bottom-4 left-12">
                Iterations
              </div>
              
              {/* Convergence curve (simplified placeholder) */}
              <svg width="200" height="100" viewBox="0 0 200 100" className="absolute left-12 bottom-12">
                <path 
                  d="M0,80 C20,70 40,40 60,25 C80,15 100,12 120,10 C140,9 160,8 180,8" 
                  fill="none" 
                  stroke="black" 
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline" className="text-sm">
              Export CSV
            </Button>
            <Button variant="outline" className="text-sm">
              Export Image
            </Button>
            <Button variant="outline" className="text-sm">
              Save Configuration
            </Button>
          </div>
        </Card>
      </div>
      
      {/* Action Options */}
      <Card className="mb-6">
        <h3 className="text-xl font-serif mb-4">Next Steps</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-black p-4">
            <h4 className="text-lg font-serif mb-3">Analysis Options</h4>
            <p className="mb-4 font-mono text-sm">
              Explore additional analysis options, including orbital visualization, 
              bond analysis, and comparison to experimental data.
            </p>
            <Button className="w-full">
              Advanced Analysis
            </Button>
          </div>
          
          <div className="border border-black p-4">
            <h4 className="text-lg font-serif mb-3">Publish Results</h4>
            <p className="mb-4 font-mono text-sm">
              Store your experimental data permanently on IPFS and verify it on blockchain
              for scientific record-keeping and sharing.
            </p>
            <Button 
              onClick={() => onNavigate('publishing')} 
              className="w-full"
            >
              Publish to Blockchain
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Navigation */}
      <NavigationFooter
        onBack={() => onNavigate('experiment-config')}
        onNext={() => onNavigate('publishing')}
        nextLabel="Proceed to Publishing"
        backLabel="Back to Config"
      />
    </PageLayout>
  );
}