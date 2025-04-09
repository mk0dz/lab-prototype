import React, { useState } from 'react';

interface ResultsProps {
  onNavigate: (section: string) => void;
}

export default function Results({ onNavigate }: ResultsProps) {
  const [resultData, setResultData] = useState({
    uploaded: false,
    ipfsId: ''
  });

  return (
    <div className="min-h-screen w-full py-6 px-4">
      <div className="flex justify-between items-center mb-8 border-b pb-2">
        <h2 className="text-2xl">Results</h2>
        <div className="text-lg">Experiment #1</div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* System Info Section */}
        <div className="border border-black p-6">
          <h3 className="text-xl mb-2">System: Name</h3>
          <p>Ansatz: PQC/Standard</p>
          <p>Date: DD/MM/YYYY</p>
          
          <h3 className="text-xl mt-6 mb-2">Abstract:</h3>
          <div className="border border-gray-300 p-4 min-h-32 mb-4">
            <p className="text-gray-500 italic">
              Description of the experiment and its significance...
            </p>
          </div>
          
          {/* Result Graph Placeholder */}
          <div className="border border-gray-300 p-4 h-64 flex items-center justify-center mb-6">
            <p className="text-gray-500">Result visualization graph will appear here</p>
          </div>
        </div>
        
        {/* Publication Section */}
        <div className="border border-black p-6">
          <div className="flex justify-between mb-6">
            <div className="border border-gray-300 py-3 px-6 flex items-center">
              <p>{resultData.uploaded ? 'Your data has been added!' : 'Test data has been added'}</p>
            </div>
            
            <button 
              className="bg-black text-white py-3 px-6"
              onClick={() => setResultData({ ...resultData, uploaded: true })}
            >
              Upload!
            </button>
          </div>
          
          <div className="border border-gray-300 p-4 mb-6">
            <p className="text-gray-700">Your IPFS id: {resultData.ipfsId || '----------'}</p>
          </div>
          
          <div className="flex justify-between">
            <button className="border border-black py-3 px-6">
              Come back!
            </button>
            
            <button className="bg-blue-500 text-white py-3 px-6">
              Publish at
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <button 
          onClick={() => onNavigate('experiment-config')} 
          className="bg-gray-200 px-6 py-2"
        >
          Back
        </button>
        <button 
          onClick={() => onNavigate('welcome')} 
          className="bg-black text-white px-6 py-2"
        >
          New Experiment
        </button>
      </div>
    </div>
  );
}
