// src/components/results.tsx
import React, { useState } from 'react';
import { PageLayout, SectionTitle, Card, Button, NavigationFooter } from './design-system';

interface ResultsProps {
  onNavigate: (section: string) => void;
}

export default function Results({ onNavigate }: ResultsProps) {
  const [resultData, setResultData] = useState({
    uploaded: false,
    ipfsId: '',
    published: false,
    transactionId: ''
  });
  
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
  
  // Simulate upload to IPFS
  const handleUpload = () => {
    // Simulate processing
    setTimeout(() => {
      setResultData({
        ...resultData,
        uploaded: true,
        ipfsId: 'Qm' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      });
    }, 1500);
  };
  
  // Simulate publishing to blockchain
  const handlePublish = () => {
    // Simulate processing
    setTimeout(() => {
      setResultData({
        ...resultData,
        published: true,
        transactionId: '0x' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      });
    }, 1500);
  };

  return (
    <PageLayout>
      <SectionTitle 
        title="Experiment Results" 
        subtitle="Step 4/4"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Results Summary */}
        <Card>
          <h3 className="text-xl font-serif mb-4">Experiment Summary</h3>
          
          <div className="space-y-3 font-mono">
            <div className="grid grid-cols-2 gap-2 border-b pb-2">
              <div className="font-bold">System:</div>
              <div>{experimentResults.name}</div>
              
              <div className="font-bold">Date:</div>
              <div>{experimentResults.date}</div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 border-b pb-2">
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
            <div className="border border-gray-300 p-3 bg-gray-50 text-sm">
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
          
          <div className="border border-gray-200 bg-gray-50 h-64 flex items-center justify-center mb-4">
            {/* Energy diagram placeholder */}
            <div className="w-full h-full flex flex-col items-center justify-center relative p-6">
              <div className="absolute left-12 top-0 bottom-0 w-px bg-gray-400"></div>
              <div className="absolute left-0 right-0 bottom-12 h-px bg-gray-400"></div>
              
              {/* Energy level marker */}
              <div className="absolute" style={{ left: '80px', bottom: '90px' }}>
                <div className="w-32 h-px bg-blue-500"></div>
                <div className="text-xs font-mono mt-1">Ground state: {experimentResults.energy.ground} Ha</div>
              </div>
              
              {/* Reference energy marker */}
              <div className="absolute" style={{ left: '80px', bottom: '110px' }}>
                <div className="w-32 h-px bg-red-500"></div>
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
                  stroke="blue" 
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
      
      {/* Blockchain Publishing Section */}
      <Card className="mb-6">
        <h3 className="text-xl font-serif mb-4">Blockchain Publication</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* IPFS Upload */}
          <div className="border border-gray-200 p-4">
            <h4 className="text-lg font-serif mb-3">IPFS Storage</h4>
            <div className="mb-4 font-mono text-sm">
              {resultData.uploaded ? (
                <div className="bg-green-50 border border-green-200 p-3">
                  <p className="font-bold text-green-800">Results uploaded successfully!</p>
                  <p className="mt-2">IPFS ID: <span className="font-bold">{resultData.ipfsId}</span></p>
                </div>
              ) : (
                <p>Upload your experimental data to IPFS for permanent storage and sharing.</p>
              )}
            </div>
            <Button 
              onClick={handleUpload} 
              disabled={resultData.uploaded}
              className="w-full"
            >
              {resultData.uploaded ? 'Uploaded' : 'Upload to IPFS'}
            </Button>
          </div>
          
          {/* Blockchain Publication */}
          <div className="border border-gray-200 p-4">
            <h4 className="text-lg font-serif mb-3">Blockchain Publication</h4>
            <div className="mb-4 font-mono text-sm">
              {resultData.published ? (
                <div className="bg-green-50 border border-green-200 p-3">
                  <p className="font-bold text-green-800">Results published on blockchain!</p>
                  <p className="mt-2">Transaction: <span className="font-bold">{resultData.transactionId}</span></p>
                </div>
              ) : (
                <p>Publish your experimental data to blockchain for verification and authentication.</p>
              )}
            </div>
            <Button 
              onClick={handlePublish} 
              disabled={!resultData.uploaded || resultData.published}
              className="w-full"
            >
              {resultData.published ? 'Published' : 'Publish to Blockchain'}
            </Button>
          </div>
        </div>
        
        <div className="mt-6 border-t pt-4">
          <h4 className="text-lg font-serif mb-3">Sharing Options</h4>
          <div className="flex space-x-4">
            <input 
              type="text" 
              readOnly
              value={resultData.ipfsId ? `https://ipfs.io/ipfs/${resultData.ipfsId}` : 'Experiment URL will appear here after upload'}
              className="flex-1 border border-gray-300 px-3 py-2 bg-gray-50"
            />
            <Button 
              onClick={() => {/* Clipboard copy would go here */}}
              disabled={!resultData.ipfsId}
            >
              Copy Link
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Navigation */}
      <NavigationFooter
        onBack={() => onNavigate('experiment-config')}
        onNext={() => onNavigate('welcome')}
        nextLabel="New Experiment"
        backLabel="Back to Config"
      />
    </PageLayout>
  );
}