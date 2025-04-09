// src/components/publishing.tsx
import React, { useState } from 'react';
import { PageLayout, SectionTitle, Card, Button, NavigationFooter } from './design-system';

interface PublishingProps {
  onNavigate: (section: string) => void;
}

export default function Publishing({ onNavigate }: PublishingProps) {
  const [publishData, setPublishData] = useState({
    uploaded: false,
    ipfsId: '',
    published: false,
    transactionId: ''
  });
  
  // Retrieve experiment data from previous screen
  // In a real implementation, this would come from context or props
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
    }
  };
  
  // Simulate upload to IPFS
  const handleUpload = () => {
    // Simulate processing
    setTimeout(() => {
      setPublishData({
        ...publishData,
        uploaded: true,
        ipfsId: 'Qm' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      });
    }, 1500);
  };
  
  // Simulate publishing to blockchain
  const handlePublish = () => {
    // Simulate processing
    setTimeout(() => {
      setPublishData({
        ...publishData,
        published: true,
        transactionId: '0x' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      });
    }, 1500);
  };

  return (
    <PageLayout>
      <div className="h-full flex flex-col">
        <SectionTitle 
          title="Blockchain Publication" 
          subtitle="Step 5/5"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow max-h-[calc(100vh-10rem)]">
          {/* Left Column */}
          <div className="flex flex-col space-y-4">
            {/* Experiment Summary (compact version) */}
            <Card className="flex-grow">
              <h3 className="text-xl font-serif mb-3">Experiment Summary</h3>
              
              <div className="space-y-3 font-mono text-sm">
                <div className="grid grid-cols-2 gap-2 border-b border-black pb-2">
                  <div className="font-bold">System:</div>
                  <div>{experimentResults.name}</div>
                  
                  <div className="font-bold">Date:</div>
                  <div>{experimentResults.date}</div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 border-b border-black pb-2">
                  <div className="font-bold">Algorithm:</div>
                  <div>{experimentResults.configuration.algorithm}</div>
                  
                  <div className="font-bold">Energy:</div>
                  <div>{experimentResults.energy.ground} {experimentResults.energy.units}</div>
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="text-lg font-serif mb-2">Publication Status</h4>
                <div className="border border-black p-3 bg-gray-50 font-mono text-sm min-h-[100px]">
                  {!publishData.uploaded && !publishData.published && (
                    <p>Ready to publish your experimental results to the decentralized web.</p>
                  )}
                  {publishData.uploaded && !publishData.published && (
                    <p>Results uploaded to IPFS. Ready for blockchain verification.</p>
                  )}
                  {publishData.published && (
                    <>
                      <p>Results successfully published and verified on blockchain.</p>
                      <p className="mt-2">Your research is now permanently recorded and can be cited using the identifiers below.</p>
                    </>
                  )}
                </div>
              </div>
            </Card>
            
            {/* Sharing Options */}
            <Card className="flex-shrink-0">
              <h4 className="text-lg font-serif mb-2">Sharing Options</h4>
              <div className="flex flex-col space-y-2">
                <input 
                  type="text" 
                  readOnly
                  value={publishData.ipfsId ? `https://ipfs.io/ipfs/${publishData.ipfsId}` : 'Experiment URL will appear here after upload'}
                  className="border border-black px-3 py-2 bg-gray-50 font-mono"
                />
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => {/* Clipboard copy would go here */}}
                    disabled={!publishData.ipfsId}
                    className="flex-1"
                  >
                    Copy Link
                  </Button>
                  <Button 
                    onClick={() => {/* Generate citation would go here */}}
                    disabled={!publishData.published}
                    className="flex-1"
                  >
                    See your work
                  </Button>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Right Column */}
          <div className="flex flex-col space-y-4">
            {/* Publication Process Visualization */}
            <Card className="flex-grow">
              <h3 className="text-xl font-serif mb-3">Publication Process</h3>
              
              <div className="flex flex-col justify-center items-center h-48 space-y-6">
                {/* Process visualization */}
                <div className="flex items-center justify-center space-x-6">
                  <div className={`w-20 h-20 border-2 flex items-center justify-center ${publishData.uploaded ? 'bg-black text-white' : 'border-black'}`}>
                    <span className="font-mono text-xs">IPFS</span>
                  </div>
                  
                  <div className="w-24 h-px bg-gray-300 relative">
                    <div className={`absolute top-0 h-px bg-black transition-all ${publishData.uploaded ? 'w-full' : 'w-0'}`}></div>
                  </div>
                  
                  <div className={`w-20 h-20 border-2 flex items-center justify-center ${publishData.published ? 'bg-black text-white' : 'border-black'}`}>
                    <span className="font-mono text-xs">BLOCKCHAIN</span>
                  </div>
                </div>
                
                <div className="text-center font-mono text-sm">
                  {!publishData.uploaded && <p>Step 1: Upload to IPFS</p>}
                  {publishData.uploaded && !publishData.published && <p>Step 2: Publish to Blockchain</p>}
                  {publishData.published && <p>Publication Complete</p>}
                </div>
                
                {/* Status indicators */}
                <div className="flex justify-between w-full px-6">
                  <div className="text-center">
                    <div className={`${publishData.uploaded ? 'text-green-600' : 'text-gray-400'} font-mono text-xs`}>
                      {publishData.ipfsId ? publishData.ipfsId.substring(0, 10) + "..." : "Not Uploaded"}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className={`${publishData.published ? 'text-green-600' : 'text-gray-400'} font-mono text-xs`}>
                      {publishData.transactionId ? publishData.transactionId.substring(0, 10) + "..." : "Not Published"}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
            
            {/* Publication Interface */}
            <Card className="flex-shrink-0">
              <h3 className="text-xl font-serif mb-3">Data Publication</h3>
              
              <div className="grid grid-cols-2 gap-4">
                {/* IPFS Upload */}
                <div className="border border-black p-3">
                  <h4 className="text-base font-serif mb-2">IPFS Storage</h4>
                  <div className="mb-3 font-mono text-xs h-10">
                    {publishData.uploaded ? (
                      <div className="text-green-600">
                        Results uploaded successfully!
                      </div>
                    ) : (
                      <p>Upload your experimental data to IPFS for permanent storage.</p>
                    )}
                  </div>
                  <Button 
                    onClick={handleUpload} 
                    disabled={publishData.uploaded}
                    className="w-full"
                  >
                    {publishData.uploaded ? 'Uploaded' : 'Upload to IPFS'}
                  </Button>
                </div>
                
                {/* Blockchain Publication */}
                <div className="border border-black p-3">
                  <h4 className="text-base font-serif mb-2">Blockchain Publication</h4>
                  <div className="mb-3 font-mono text-xs h-10">
                    {publishData.published ? (
                      <div className="text-green-600">
                        Results published on blockchain!
                      </div>
                    ) : (
                      <p>Publish experimental data to blockchain for verification.</p>
                    )}
                  </div>
                  <Button 
                    onClick={handlePublish} 
                    disabled={!publishData.uploaded || publishData.published}
                    className="w-full"
                  >
                    {publishData.published ? 'Published' : 'Publish to Blockchain'}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <NavigationFooter
        onBack={() => onNavigate('results')}
        onNext={() => onNavigate('welcome')}
        nextLabel="New Experiment"
        backLabel="Back to Results"
      />
    </PageLayout>
  );
}