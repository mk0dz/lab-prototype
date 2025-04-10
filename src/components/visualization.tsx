import React, { useState, useEffect, useRef } from 'react';
import { useQuantumSystem } from './context';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Card } from './design-system';

// Define atom configurations first
const atomConfigs = {
  H: { name: "Hydrogen", electrons: 1, color: "#3b82f6", radius: 32, atomicWeight: 1.008, ionizationEnergy: 13.6, electronAffinity: 0.75 },
  He: { name: "Helium", electrons: 2, color: "#8b5cf6", radius: 32, atomicWeight: 4.003, ionizationEnergy: 24.6, electronAffinity: 0 },
  Li: { name: "Lithium", electrons: 3, color: "#ec4899", radius: 36, atomicWeight: 6.94, ionizationEnergy: 5.4, electronAffinity: 0.62 },
  Be: { name: "Beryllium", electrons: 4, color: "#f97316", radius: 36, atomicWeight: 9.012, ionizationEnergy: 9.3, electronAffinity: 0 },
  B: { name: "Boron", electrons: 5, color: "#84cc16", radius: 36, atomicWeight: 10.81, ionizationEnergy: 8.3, electronAffinity: 0.28 },
  C: { name: "Carbon", electrons: 6, color: "#525252", radius: 36, atomicWeight: 12.01, ionizationEnergy: 11.3, electronAffinity: 1.26 },
  N: { name: "Nitrogen", electrons: 7, color: "#0ea5e9", radius: 36, atomicWeight: 14.01, ionizationEnergy: 14.5, electronAffinity: 0 },
  O: { name: "Oxygen", electrons: 8, color: "#ef4444", radius: 36, atomicWeight: 16.00, ionizationEnergy: 13.6, electronAffinity: 1.46 },
  F: { name: "Fluorine", electrons: 9, color: "#22c55e", radius: 36, atomicWeight: 19.00, ionizationEnergy: 17.4, electronAffinity: 3.40 },
  Ne: { name: "Neon", electrons: 10, color: "#d946ef", radius: 36, atomicWeight: 20.18, ionizationEnergy: 21.6, electronAffinity: 0 }
};

// Define molecule configurations with 3D coordinates
const moleculeConfigs = {
  "H2": {
    name: "Hydrogen Molecule",
    atoms: [
      { element: "H", x: -0.7, y: 0, z: 0 },
      { element: "H", x: 0.7, y: 0, z: 0 }
    ],
    bonds: [
      { from: 0, to: 1, type: "single" }
    ],
    properties: {
      bondLength: "0.74 Å",
      bondEnergy: "432 kJ/mol",
      point_group: "D∞h",
      molecular_weight: "2.016 g/mol"
    }
  },
  "H2O": {
    name: "Water",
    atoms: [
      { element: "O", x: 0, y: 0, z: 0 },
      { element: "H", x: -0.76, y: -0.59, z: 0 },
      { element: "H", x: 0.76, y: -0.59, z: 0 }
    ],
    bonds: [
      { from: 0, to: 1, type: "single" },
      { from: 0, to: 2, type: "single" }
    ],
    properties: {
      bondAngle: "104.5°",
      bondLength: "0.96 Å",
      dipole_moment: "1.85 D",
      point_group: "C2v",
      molecular_weight: "18.01 g/mol"
    }
  },
  "CH4": {
    name: "Methane",
    atoms: [
      { element: "C", x: 0, y: 0, z: 0 },
      { element: "H", x: 0.63, y: 0.63, z: 0.63 },
      { element: "H", x: -0.63, y: -0.63, z: 0.63 },
      { element: "H", x: -0.63, y: 0.63, z: -0.63 },
      { element: "H", x: 0.63, y: -0.63, z: -0.63 }
    ],
    bonds: [
      { from: 0, to: 1, type: "single" },
      { from: 0, to: 2, type: "single" },
      { from: 0, to: 3, type: "single" },
      { from: 0, to: 4, type: "single" }
    ],
    properties: {
      bondAngle: "109.5°",
      bondLength: "1.09 Å",
      point_group: "Td",
      molecular_weight: "16.04 g/mol"
    }
  },
  "LiH": {
    name: "Lithium Hydride",
    atoms: [
      { element: "Li", x: -0.8, y: 0, z: 0 },
      { element: "H", x: 0.8, y: 0, z: 0 }
    ],
    bonds: [
      { from: 0, to: 1, type: "single" }
    ],
    properties: {
      bondLength: "1.60 Å",
      dipole_moment: "5.88 D",
      point_group: "C∞v",
      molecular_weight: "7.95 g/mol"
    }
  },
  "NH3": {
    name: "Ammonia",
    atoms: [
      { element: "N", x: 0, y: 0, z: 0 },
      { element: "H", x: 0.94, y: 0, z: -0.33 },
      { element: "H", x: -0.47, y: 0.82, z: -0.33 },
      { element: "H", x: -0.47, y: -0.82, z: -0.33 }
    ],
    bonds: [
      { from: 0, to: 1, type: "single" },
      { from: 0, to: 2, type: "single" },
      { from: 0, to: 3, type: "single" }
    ],
    properties: {
      bondAngle: "107.3°",
      bondLength: "1.02 Å",
      dipole_moment: "1.47 D",
      point_group: "C3v",
      molecular_weight: "17.03 g/mol"
    }
  }
};

const AtomVisualization = ({ element = 'H', type = "basic" }: { element?: keyof typeof atomConfigs, type?: string }) => {
  // Default to Hydrogen if element not found
  const config = atomConfigs[element] || atomConfigs.H;
  
  // Number of electrons to show
  const electronCount = Math.min(config.electrons, 10); // Limit to first 10 electrons for simplicity
  
  // Generate orbit and electron positions
  const generateOrbitPositions = (count: number) => {
    const positions = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      positions.push({
        x: Math.cos(angle),
        y: Math.sin(angle)
      });
    }
    return positions;
  };
  
  // Shell layouts based on electron count
  const getShellLayout = (total: number) => {
    if (total === 0) return [0]; // Handle case with no electrons
    if (total <= 2) return [total];
    if (total <= 10) return [2, total - 2];
    if (total <= 18) return [2, 8, total - 10];
    return [2, 8, 10, total - 20];
  };
  
  const shells = getShellLayout(electronCount);
  
  // Animation for electron movement
  const [rotation, setRotation] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 1) % 360);
    }, 50);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Nucleus */}
        <div 
          className="absolute rounded-full z-10"
          style={{ 
            width: `${config.radius * 0.7}px`, 
            height: `${config.radius * 0.7}px`, 
            backgroundColor: config.color,
          }}
        />
        
        {/* Electron shells */}
        {shells && shells.map((electronsInShell, shellIndex) => {
          const orbitRadius = 25 + (shellIndex * 20);
          const electronPositions = generateOrbitPositions(electronsInShell);
          
          return (
            <React.Fragment key={`shell-${shellIndex}`}>
              {/* Orbit path */}
              <div 
                className="absolute rounded-full border border-gray-300"
                style={{ 
                  width: `${orbitRadius * 2}px`, 
                  height: `${orbitRadius * 2}px`,
                }}
              />
              
              {/* Electrons in this shell */}
              {electronPositions.map((pos, idx) => (
                <div 
                  key={`electron-${shellIndex}-${idx}`}
                  className="absolute w-2.5 h-2.5 rounded-full bg-blue-500"
                  style={{ 
                    transform: `translate(-50%, -50%) rotate(${rotation}deg) translate(${orbitRadius}px, 0) rotate(${idx * (360 / electronsInShell)}deg)`,
                  }}
                />
              ))}
            </React.Fragment>
          );
        })}
      </div>
      
      {/* Electron count text */}
      <div className="absolute bottom-1 text-xs text-center w-full">
        {electronCount} {electronCount === 1 ? 'electron' : 'electrons'}
      </div>
    </div>
  );
};

const ThreeDMoleculeVisualization = ({ formula = 'H2' }: { formula?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Clean up function to remove previous visualization
    const container = containerRef.current;
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    
    // Get proper lowercase formula for lookup
    const formulaLower = formula.toLowerCase();
    
    // Get molecule configuration or default to H2 if not found
    const moleculeConfig = moleculeConfigs[formulaLower as keyof typeof moleculeConfigs] || 
                          moleculeConfigs.H2;
    
    // Set up the scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    
    // Set up the camera
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Set up renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xcccccc, 1);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Calculate molecule center for camera positioning
    let center = new THREE.Vector3(0, 0, 0);
    let atomCount = 0;
    
    // Add atoms to the scene
    const atomObjects: THREE.Mesh[] = [];
    
    moleculeConfig.atoms.forEach((atom) => {
      const atomConfig = atomConfigs[atom.element as keyof typeof atomConfigs];
      
      // Create atom sphere geometry based on atomic radius
      const atomScale = atomConfig ? atomConfig.radius / 35 : 0.5;
      const geometry = new THREE.SphereGeometry(atomScale, 32, 32);
      
      // Create material with atom color
      const material = new THREE.MeshPhongMaterial({ 
        color: atomConfig ? atomConfig.color : '#cccccc',
        specular: 0x111111,
        shininess: 30
      });
      
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(atom.x, atom.y, atom.z);
      
      // Update center calculation
      center.add(new THREE.Vector3(atom.x, atom.y, atom.z));
      atomCount++;
      
      scene.add(sphere);
      atomObjects.push(sphere);
    });
    
    // Add bonds
    moleculeConfig.bonds.forEach((bond) => {
      const fromAtom = moleculeConfig.atoms[bond.from];
      const toAtom = moleculeConfig.atoms[bond.to];
      
      // Calculate bond position and direction
      const startPos = new THREE.Vector3(fromAtom.x, fromAtom.y, fromAtom.z);
      const endPos = new THREE.Vector3(toAtom.x, toAtom.y, toAtom.z);
      
      // Calculate distance and midpoint
      const distance = startPos.distanceTo(endPos);
      
      // Create a cylinder to represent the bond
      const bondGeometry = new THREE.CylinderGeometry(0.05, 0.05, distance, 8);
      const bondMaterial = new THREE.MeshPhongMaterial({ color: 0xDDDDDD });
      
      const bondMesh = new THREE.Mesh(bondGeometry, bondMaterial);
      
      // Position and rotate the bond
      const midpoint = new THREE.Vector3().addVectors(startPos, endPos).multiplyScalar(0.5);
      bondMesh.position.copy(midpoint);
      
      // Orient the bond to connect the atoms
      bondMesh.lookAt(endPos);
      bondMesh.rotateX(Math.PI / 2);
      
      scene.add(bondMesh);
    });
    
    // Calculate the average position for centering the camera
    if (atomCount > 0) {
      center.divideScalar(atomCount);
    }
    
    // Set up orbital controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.copy(center);
    controls.update();
    
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    
    const handleResize = () => {
      if (!containerRef.current) return;
      
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    
    setIsLoading(false);
    animate();
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      // Clean up Three.js resources
      renderer.dispose();
      scene.clear();
    };
  }, [formula]); // Re-run when formula changes
  
  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-black"></div>
        </div>
      )}
      <div ref={containerRef} className="w-full h-full"></div>
    </div>
  );
};

// 2D Molecule Visualization (original one)
const MoleculeVisualization = ({ formula = 'H2' }: { formula?: keyof typeof moleculeConfigs }) => {
  // Normalize formula (e.g., H₂ or H2 to H2)
  const normalizedFormula = formula ? formula.replace(/₂/g, "2").replace(/₃/g, "3").replace(/₄/g, "4") : "";
  
  // Get configuration or use H2 as default
  const config = normalizedFormula && moleculeConfigs[normalizedFormula as keyof typeof moleculeConfigs] ? 
    moleculeConfigs[normalizedFormula as keyof typeof moleculeConfigs] : 
    moleculeConfigs.H2;
  
  // Atom colors
  const atomColors = {
    H: "#3b82f6",
    Li: "#ec4899",
    O: "#ef4444",
    C: "#525252",
    N: "#0ea5e9",
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Render bonds first (behind atoms) */}
        {config && config.bonds && config.bonds.map((bond: { from: number, to: number, type: string }, idx: number) => {
          const fromAtom = config.atoms[bond.from];
          const toAtom = config.atoms[bond.to];
          
          // Calculate angle and distance for the bond
          const dx = toAtom.x - fromAtom.x;
          const dy = toAtom.y - fromAtom.y;
          const angle = Math.atan2(dy, dx) * (180 / Math.PI);
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          return (
            <div 
              key={`bond-${idx}`}
              className="absolute bg-gray-600"
              style={{
                width: `${distance * 50}px`,
                height: "2px",
                left: `${fromAtom.x * 50 + 100}px`,
                top: `${fromAtom.y * 50 + 100}px`,
                transformOrigin: "left center",
                transform: `rotate(${angle}deg)`,
              }}
            />
          );
        })}
        
        {/* Render atoms */}
        {config && config.atoms && config.atoms.map((atom: { element: string, x: number, y: number, z: number }, idx: number) => (
          <div 
            key={`atom-${idx}`}
            className="absolute rounded-full flex items-center justify-center font-mono text-white"
            style={{
              width: atom.element === "H" ? "20px" : "30px",
              height: atom.element === "H" ? "20px" : "30px",
              left: `${atom.x * 50 + 100 - (atom.element === "H" ? 10 : 15)}px`,
              top: `${atom.y * 50 + 100 - (atom.element === "H" ? 10 : 15)}px`,
              backgroundColor: atomColors[atom.element as keyof typeof atomColors] || "#525252",
            }}
          >
            {atom.element}
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <div className="text-xl font-serif">{config.name}</div>
        <div className="text-sm font-mono">{formula}</div>
      </div>
    </div>
  );
};

const SystemElementsBox = ({ systemId }: { systemId: string }) => {
  // Get proper capitalized or formatted system ID
  const formattedSystemId = systemId.toLowerCase();
  const molecule = moleculeConfigs[formattedSystemId as keyof typeof moleculeConfigs] || 
                  moleculeConfigs.H2; // Default to H2 if not found
  
  // Get atom configurations from molecule
  const atoms = molecule?.atoms || [];
  
  return (
    <Card className="h-full">
      <h3 className="text-lg font-bold mb-3 font-serif">System Elements</h3>
      <div className="overflow-y-auto h-[calc(100%-3rem)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Element</th>
              <th className="text-left p-2">Count</th>
              <th className="text-left p-2">Properties</th>
            </tr>
          </thead>
          <tbody>
            {atoms.length > 0 ? (
              // Count occurrences of each element in the molecule
              Object.entries(
                atoms.reduce((acc, atom) => {
                  const element = atom.element;
                  acc[element] = (acc[element] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
              ).map(([element, count], index) => {
                const atomConfig = atomConfigs[element as keyof typeof atomConfigs];
                return (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: atomConfig?.color || '#888' }}
                        />
                        <span>{atomConfig?.name || element}</span>
                      </div>
                    </td>
                    <td className="p-2">{count}</td>
                    <td className="p-2 text-xs">
                      <div>Weight: {atomConfig?.atomicWeight || 'N/A'} u</div>
                      <div>Electrons: {atomConfig?.electrons || 'N/A'}</div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={3} className="text-center p-4 text-gray-500">
                  No atomic data available for this system
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

const SystemPropertiesBox = ({ systemId }: { systemId: string }) => {
  // Get proper capitalized or formatted system ID for lookup
  const formattedSystemId = systemId.toLowerCase();
  
  // Get molecule data, defaulting to H2 if not found
  const molecule = moleculeConfigs[formattedSystemId as keyof typeof moleculeConfigs] || 
                  moleculeConfigs.H2;
                  
  // Ensure we have properties
  const properties = molecule?.properties || {
    bondLength: "N/A",
    bondEnergy: "N/A",
    point_group: "N/A",
    molecular_weight: "N/A"
  };
  
  // Calculate total atoms
  const totalAtoms = molecule?.atoms?.length || 0;
  
  // Generate spectroscopic constants if not available
  const spectroscopicData = {
    rotationalConstant: "1.432 cm⁻¹",
    vibrationalFrequency: "4395 cm⁻¹",
    dissociationEnergy: "4.52 eV",
  };
  
  return (
    <Card className="h-full">
      <h3 className="text-lg font-bold mb-3 font-serif">System Properties</h3>
      <div className="space-y-3">
        <div>
          <h4 className="text-sm font-bold border-b pb-1">Geometry</h4>
          <div className="grid grid-cols-2 gap-x-2 text-sm mt-1">
            <div>Total Atoms:</div>
            <div className="font-mono">{totalAtoms}</div>
            
            <div>Bond Length:</div>
            <div className="font-mono">{properties.bondLength || "N/A"}</div>
            
            {'bondAngle' in properties && (
              <>
                <div>Bond Angle:</div>
                <div className="font-mono">{properties.bondAngle}</div>
              </>
            )}
            
            <div>Point Group:</div>
            <div className="font-mono">{properties.point_group || "N/A"}</div>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-bold border-b pb-1">Spectroscopic</h4>
          <div className="grid grid-cols-2 gap-x-2 text-sm mt-1">
            <div>Rotational Constant:</div>
            <div className="font-mono">{spectroscopicData.rotationalConstant}</div>
            
            <div>Vibrational Frequency:</div>
            <div className="font-mono">{spectroscopicData.vibrationalFrequency}</div>
            
            <div>Dissociation Energy:</div>
            <div className="font-mono">{spectroscopicData.dissociationEnergy}</div>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-bold border-b pb-1">Molecular</h4>
          <div className="grid grid-cols-2 gap-x-2 text-sm mt-1">
            <div>Molecular Weight:</div>
            <div className="font-mono">{properties.molecular_weight || "N/A"}</div>
            
            {'dipole_moment' in properties && (
              <>
                <div>Dipole Moment:</div>
                <div className="font-mono">{properties.dipole_moment}</div>
              </>
            )}
            
            {'bondEnergy' in properties && (
              <>
                <div>Bond Energy:</div>
                <div className="font-mono">{properties.bondEnergy}</div>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

const QuantumVisualizationComponent = () => {
  const { systemData } = useQuantumSystem();
  const systemId = systemData.systemId || '';
  
  // Check if it's a molecule (contains numbers or multiple elements)
  const isMolecule = systemId ? (/[0-9]/.test(systemId) || systemId.length > 2) : false;
  
  if (!systemId) {
    return (
      <div className="flex items-center justify-center h-full text-lg text-gray-500">
        Select a quantum system to visualize
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
        {/* Left column: Selected system info */}
        <div className="md:col-span-1 flex flex-col gap-4">
          <SystemElementsBox systemId={systemId} />
          <SystemPropertiesBox systemId={systemId} />
        </div>
        
        {/* Right column: Visualization */}
        <div className="md:col-span-2 border border-gray-300 p-4 flex flex-col h-full">
          <h3 className="text-lg font-serif mb-2">System Visualization</h3>
          
          {/* Visualization content */}
          <div className="flex-grow overflow-hidden">
            {isMolecule ? (
              <div className="flex flex-col h-full">
                <h4 className="text-md font-serif mb-2">3D Molecular Structure</h4>
                <div className="flex-grow">
                  <ThreeDMoleculeVisualization formula={systemId} />
                </div>
                
                <h4 className="text-md font-serif mt-4 mb-2">Individual Atom Structures</h4>
                <div className="grid grid-cols-2 gap-4 mb-2">
                  {/* Get unique elements from molecule */}
                  {Array.from(new Set((moleculeConfigs[systemId as keyof typeof moleculeConfigs]?.atoms || [])
                    .map(atom => atom.element)))
                    .map(element => (
                      <div key={element} className="border border-gray-200 p-2 flex justify-center">
                        <AtomVisualization element={element as keyof typeof atomConfigs} />
                      </div>
                    ))
                  }
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <AtomVisualization element={systemId as keyof typeof atomConfigs} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuantumVisualizationComponent;