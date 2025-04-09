import React from 'react';

interface QuantumVisualizationProps {
  systemType: string;
}

export default function QuantumVisualization({ systemType }: QuantumVisualizationProps) {
  // This would be enhanced with actual visualization logic
  // For now, we'll just show basic atom representations

  const renderSystem = () => {
    switch(systemType) {
      case 'H':
        return (
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-2 border-gray-300"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black"></div>
              <div className="absolute top-1/4 left-3/4 w-4 h-4 rounded-full bg-blue-500"></div>
            </div>
            <div className="ml-4 text-lg">Hydrogen</div>
          </div>
        );
      case 'He':
        return (
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-2 border-gray-300"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black"></div>
              <div className="absolute top-1/4 left-3/4 w-4 h-4 rounded-full bg-blue-500"></div>
              <div className="absolute top-3/4 left-1/4 w-4 h-4 rounded-full bg-blue-500"></div>
            </div>
            <div className="ml-4 text-lg">Helium</div>
          </div>
        );
      case 'H2':
      case 'H₂':
        return (
          <div className="flex items-center justify-center">
            <div className="relative flex">
              <div className="relative mr-12">
                <div className="w-20 h-20 rounded-full border-2 border-gray-300"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black"></div>
              </div>
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-2 border-gray-300"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black"></div>
              </div>
              <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 w-16 h-1 bg-gray-500"></div>
            </div>
            <div className="ml-4 text-lg">Hydrogen Molecule</div>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center text-lg">
            Select a quantum system to visualize
          </div>
        );
    }
  };

  return (
    <div className="border border-gray-300 rounded p-6 h-full flex items-center justify-center">
      {renderSystem()}
    </div>
  );
}