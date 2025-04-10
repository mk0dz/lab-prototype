// src/components/welcome.tsx
import React from 'react';
import { Card, SectionTitle } from './design-system';

interface WelcomeProps {
  onNavigate: (section: string) => void;
}

export default function Welcome({ onNavigate }: WelcomeProps) {
  return (
    <div className="flex flex-col h-full">
      <SectionTitle 
        title="Quantum Chemistry Laboratory" 
        subtitle="Advanced Molecule Simulation Platform"
      />
      
      <div className="flex-grow flex flex-col md:flex-row items-stretch gap-6 my-6">
        {/* Main Welcome Content */}
        <div className="md:w-1/2 flex flex-col gap-6">
          <Card className="flex-grow">
            <div className="flex flex-col h-full">
              <div className="mb-6">
                <h2 className="text-2xl font-serif mb-4">Welcome to the Quantum Lab</h2>
                <p className="leading-relaxed">
                  This platform allows you to perform quantum chemistry calculations 
                  on molecular systems using state-of-the-art quantum algorithms.
                </p>
                <p className="mt-3 leading-relaxed">
                  Design, configure, and analyze quantum simulations with our intuitive 
                  interface. Explore ground state energies, molecular properties, and 
                  electronic structures through advanced visualization tools.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="border border-gray-200 p-4 rounded-lg">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-blue-600">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-lg">Molecule Design</h3>
                  <p className="text-sm mt-1 text-gray-600">
                    Configure and simulate a variety of molecular systems
                  </p>
                </div>
                
                <div className="border border-gray-200 p-4 rounded-lg">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-purple-600">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-lg">Quantum Algorithms</h3>
                  <p className="text-sm mt-1 text-gray-600">
                    Run advanced quantum algorithms for chemical calculations
                  </p>
                </div>
                
                <div className="border border-gray-200 p-4 rounded-lg">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-green-600">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-lg">Advanced Analysis</h3>
                  <p className="text-sm mt-1 text-gray-600">
                    Visualize and analyze calculation results
                  </p>
                </div>
                
                <div className="border border-gray-200 p-4 rounded-lg">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-red-600">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-lg">Data Export</h3>
                  <p className="text-sm mt-1 text-gray-600">
                    Export and share your simulation results
                  </p>
                </div>
              </div>
              
              <div className="mt-auto">
                <button
                  onClick={() => onNavigate('quantum-system')}
                  className="w-full py-3 px-6 bg-black text-white hover:bg-gray-800 transition-colors duration-200 font-medium text-lg"
                >
                  Start New Simulation
                </button>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Visual Right Side */}
        <div className="md:w-1/2 flex flex-col gap-6">
          {/* Molecule Visualization */}
          <Card className="flex-1">
            <h3 className="text-xl font-serif mb-3">Featured Molecules</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded overflow-hidden">
                <div className="aspect-square bg-gray-50 flex items-center justify-center p-2">
                  <div className="relative w-3/4 h-3/4">
                    {/* Simple H2O visualization */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-red-500 z-10"></div>
                    <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-blue-500"></div>
                    <div className="absolute top-1/4 right-1/4 transform translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-blue-500"></div>
                    <div className="absolute top-1/4 left-1/4 w-1 h-12 bg-gray-400 transform -translate-x-1/2 -translate-y-1/2 rotate-45 origin-top"></div>
                    <div className="absolute top-1/4 right-1/4 w-1 h-12 bg-gray-400 transform translate-x-1/2 -translate-y-1/2 -rotate-45 origin-top"></div>
                  </div>
                </div>
                <div className="p-2 bg-gray-50">
                  <p className="font-mono text-center">H₂O</p>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded overflow-hidden">
                <div className="aspect-square bg-gray-50 flex items-center justify-center p-2">
                  <div className="relative w-3/4 h-3/4">
                    {/* Simple CH4 visualization */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-700 z-10"></div>
                    <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-blue-400"></div>
                    <div className="absolute top-1/4 right-1/4 transform translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-blue-400"></div>
                    <div className="absolute bottom-1/4 left-1/4 transform -translate-x-1/2 translate-y-1/2 w-4 h-4 rounded-full bg-blue-400"></div>
                    <div className="absolute bottom-1/4 right-1/4 transform translate-x-1/2 translate-y-1/2 w-4 h-4 rounded-full bg-blue-400"></div>
                  </div>
                </div>
                <div className="p-2 bg-gray-50">
                  <p className="font-mono text-center">CH₄</p>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded overflow-hidden">
                <div className="aspect-square bg-gray-50 flex items-center justify-center p-2">
                  <div className="relative w-3/4 h-3/4">
                    {/* Simple NH3 visualization */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-blue-600 z-10"></div>
                    <div className="absolute top-1/4 left-1/3 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-blue-400"></div>
                    <div className="absolute top-1/4 right-1/3 transform translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-blue-400"></div>
                    <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-4 h-4 rounded-full bg-blue-400"></div>
                  </div>
                </div>
                <div className="p-2 bg-gray-50">
                  <p className="font-mono text-center">NH₃</p>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded overflow-hidden">
                <div className="aspect-square bg-gray-50 flex items-center justify-center p-2">
                  <div className="relative w-3/4 h-3/4">
                    {/* Simple CO2 visualization */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-700 z-10"></div>
                    <div className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-red-500"></div>
                    <div className="absolute top-1/2 right-1/4 transform translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-red-500"></div>
                    <div className="absolute top-1/2 left-[37%] w-8 h-1 bg-gray-400 transform -translate-y-1/2"></div>
                    <div className="absolute top-1/2 right-[37%] w-8 h-1 bg-gray-400 transform -translate-y-1/2"></div>
                  </div>
                </div>
                <div className="p-2 bg-gray-50">
                  <p className="font-mono text-center">CO₂</p>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Information Card */}
          <Card className="flex-1">
            <h3 className="text-xl font-serif mb-3">What's New</h3>
            <div className="space-y-3">
              <div className="flex items-start border-b pb-2">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-50 flex items-center justify-center rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h4 className="font-bold">Improved Convergence Analysis</h4>
                  <p className="text-sm text-gray-600">Advanced visualization tools for tracking convergence in iterative calculations</p>
                </div>
              </div>
              
              <div className="flex items-start border-b pb-2">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-50 flex items-center justify-center rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h4 className="font-bold">Enhanced Hardware Integration</h4>
                  <p className="text-sm text-gray-600">Support for the latest quantum hardware providers and optimizations</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-green-50 flex items-center justify-center rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h4 className="font-bold">Advanced Export Options</h4>
                  <p className="text-sm text-gray-600">Export results in multiple formats for seamless integration with other tools</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}