import React, { useState, useEffect, useRef } from 'react';
import { useQuantumSystem } from './context';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

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

const ThreeDMoleculeVisualization = ({ formula = 'H2' }: { formula?: keyof typeof moleculeConfigs }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scene, camera, renderer } = useRef<{
    scene: THREE.Scene | null,
    camera: THREE.PerspectiveCamera | null,
    renderer: THREE.WebGLRenderer | null
  }>({
    scene: null,
    camera: null,
    renderer: null
  }).current;
  
  // Defaults for molecule not found
  const moleculeConfig = moleculeConfigs[formula] || moleculeConfigs.H2O;
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Clean up any existing scene
    if (renderer) {
      containerRef.current.removeChild(renderer.domElement);
    }
    
    // Initialize Three.js scene
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight || 400; // Fallback height if container has no height
    
    // Create scene
    const newScene = new THREE.Scene();
    newScene.background = new THREE.Color(0xffffff);
    
    // Create camera
    const newCamera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    newCamera.position.z = 5;
    
    // Create renderer
    const newRenderer = new THREE.WebGLRenderer({ antialias: true });
    newRenderer.setSize(width, height);
    containerRef.current.appendChild(newRenderer.domElement);
    
    // Add controls
    const controls = new OrbitControls(newCamera, newRenderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    newScene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    newScene.add(directionalLight);
    
    // Create atoms and bonds based on molecule configuration
    moleculeConfig.atoms.forEach((atom, index) => {
      const atomConfig = atomConfigs[atom.element as keyof typeof atomConfigs];
      const color = atomConfig ? atomConfig.color : '#cccccc';
      
      const geometry = new THREE.SphereGeometry(atomConfig ? atomConfig.radius / 40 : 0.4);
      const material = new THREE.MeshPhongMaterial({ color });
      const sphere = new THREE.Mesh(geometry, material);
      
      // Position atom
      sphere.position.set(atom.x, atom.y, atom.z);
      newScene.add(sphere);
      
      // Add atom labels
      const div = document.createElement('div');
      div.className = 'absolute text-xs font-bold';
      div.textContent = atom.element;
      
      // Store reference for animation
      (sphere as any).userData = { element: atom.element, index };
    });
    
    // Create bonds between atoms
    moleculeConfig.bonds.forEach(bond => {
      const atom1 = moleculeConfig.atoms[bond.from];
      const atom2 = moleculeConfig.atoms[bond.to];
      
      const start = new THREE.Vector3(atom1.x, atom1.y, atom1.z);
      const end = new THREE.Vector3(atom2.x, atom2.y, atom2.z);
      
      // Calculate the midpoint for proper cylinder placement
      const direction = new THREE.Vector3().subVectors(end, start);
      const midpoint = new THREE.Vector3().addVectors(start, direction.multiplyScalar(0.5));
      
      // Create cylinder for bond
      const geometry = new THREE.CylinderGeometry(0.1, 0.1, direction.length());
      const material = new THREE.MeshPhongMaterial({ color: 0x444444 });
      const cylinder = new THREE.Mesh(geometry, material);
      
      // Position and rotate cylinder to connect atoms
      cylinder.position.copy(midpoint);
      cylinder.lookAt(end);
      cylinder.rotateX(Math.PI / 2);
      
      newScene.add(cylinder);
    });
    
    // Animate function
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      newRenderer.render(newScene, newCamera);
    };
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight || 400;
      
      newCamera.aspect = newWidth / newHeight;
      newCamera.updateProjectionMatrix();
      newRenderer.setSize(newWidth, newHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      if (containerRef.current && newRenderer) {
        containerRef.current.removeChild(newRenderer.domElement);
      }
    };
  }, [formula]);
  
  return (
    <div className="relative w-full h-full min-h-[300px]" ref={containerRef}>
      <div className="absolute bottom-2 left-2 text-xs text-gray-500">
        Click and drag to rotate
        <br />
        Scroll to zoom
      </div>
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
  const isMolecule = systemId ? (/[0-9]/.test(systemId) || systemId.length > 2) : false;
  
  if (isMolecule) {
    // It's a molecule
    const moleculeConfig = moleculeConfigs[systemId as keyof typeof moleculeConfigs];
    
    if (!moleculeConfig) {
      return (
        <div className="border border-gray-300 p-4 h-full">
          <h3 className="text-lg font-serif mb-2">System Elements</h3>
          <p className="text-gray-500">No data available for this system</p>
        </div>
      );
    }
    
    // Group atoms by element type
    const atomCounts: Record<string, number> = {};
    moleculeConfig.atoms.forEach(atom => {
      const element = atom.element;
      atomCounts[element] = (atomCounts[element] || 0) + 1;
    });
    
    return (
      <div className="border border-gray-300 p-4 h-full">
        <h3 className="text-lg font-serif mb-2">System Elements</h3>
        <div className="space-y-1">
          {Object.entries(atomCounts).map(([element, count]) => {
            const atomConfig = atomConfigs[element as keyof typeof atomConfigs];
            return (
              <div key={element} className="flex items-center p-1 rounded-md border border-gray-200">
                <div 
                  className="w-6 h-6 rounded-full mr-2 flex-shrink-0"
                  style={{ backgroundColor: atomConfig?.color || '#cccccc' }}
                />
                <div className="font-mono">
                  {element} - {atomConfig?.name || element}
                  {count > 1 && <span className="text-xs ml-1">×{count}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  } else {
    // Single atom
    const atomConfig = atomConfigs[systemId as keyof typeof atomConfigs];
    
    if (!atomConfig) {
      return (
        <div className="border border-gray-300 p-4 h-full">
          <h3 className="text-lg font-serif mb-2">System Elements</h3>
          <p className="text-gray-500">No data available for this element</p>
        </div>
      );
    }
    
    return (
      <div className="border border-gray-300 p-4 h-full">
        <h3 className="text-lg font-serif mb-2">System Elements</h3>
        <div className="flex items-center p-1 rounded-md border border-gray-200">
          <div 
            className="w-6 h-6 rounded-full mr-2 flex-shrink-0"
            style={{ backgroundColor: atomConfig.color }}
          />
          <div className="font-mono">
            {systemId} - {atomConfig.name}
          </div>
        </div>
      </div>
    );
  }
};

const SystemPropertiesBox = ({ systemId }: { systemId: string }) => {
  const isMolecule = systemId ? (/[0-9]/.test(systemId) || systemId.length > 2) : false;
  
  if (isMolecule) {
    // It's a molecule
    const config = moleculeConfigs[systemId as keyof typeof moleculeConfigs];
    
    if (!config || !config.properties) {
      return (
        <div className="border border-gray-300 p-4 h-full">
          <h3 className="text-lg font-serif mb-2">System Properties</h3>
          <p className="text-gray-500">No property information available</p>
        </div>
      );
    }
    
    return (
      <div className="border border-gray-300 p-4 h-full">
        <h3 className="text-lg font-serif mb-2">System Properties</h3>
        <table className="w-full text-sm font-mono">
          <tbody>
            {Object.entries(config.properties).map(([key, value]) => (
              <tr key={key} className="border-b border-gray-200">
                <td className="py-2 pr-2 font-semibold">{key}</td>
                <td className="py-2">{value as string}</td>
              </tr>
            ))}
            <tr className="border-b border-gray-200">
              <td className="py-2 pr-2 font-semibold">atoms</td>
              <td className="py-2">{config.atoms.length}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-2 pr-2 font-semibold">bonds</td>
              <td className="py-2">{config.bonds.length}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  } else {
    // For single atoms
    const element = systemId as keyof typeof atomConfigs;
    const atomConfig = atomConfigs[element] || null;
    
    if (!atomConfig) {
      return (
        <div className="border border-gray-300 p-4 h-full">
          <h3 className="text-lg font-serif mb-2">System Properties</h3>
          <p className="text-gray-500">No property information available</p>
        </div>
      );
    }
    
    return (
      <div className="border border-gray-300 p-4 h-full">
        <h3 className="text-lg font-serif mb-2">System Properties</h3>
        <table className="w-full text-sm font-mono">
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="py-2 pr-2 font-semibold">Atomic Weight</td>
              <td className="py-2">{atomConfig.atomicWeight} u</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-2 pr-2 font-semibold">Electrons</td>
              <td className="py-2">{atomConfig.electrons}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-2 pr-2 font-semibold">Ionization Energy</td>
              <td className="py-2">{atomConfig.ionizationEnergy} eV</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-2 pr-2 font-semibold">Electron Affinity</td>
              <td className="py-2">{atomConfig.electronAffinity} eV</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
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
                  <ThreeDMoleculeVisualization formula={systemId as keyof typeof moleculeConfigs} />
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