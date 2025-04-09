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
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Nucleus */}
        <div 
          className="absolute rounded-full z-10"
          style={{ 
            width: `${config.radius}px`, 
            height: `${config.radius}px`, 
            backgroundColor: config.color,
          }}
        />
        
        {/* Electron shells */}
        {shells && shells.map((electronsInShell, shellIndex) => {
          const orbitRadius = 40 + (shellIndex * 30);
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
                  className="absolute w-3 h-3 rounded-full bg-blue-500"
                  style={{ 
                    transform: `translate(-50%, -50%) rotate(${rotation}deg) translate(${orbitRadius}px, 0) rotate(${idx * (360 / electronsInShell)}deg)`,
                  }}
                />
              ))}
            </React.Fragment>
          );
        })}
      </div>
      
      <div className="mt-4 text-center">
        <div className="text-xl font-serif">{config.name}</div>
        <div className="text-sm font-mono">{element}</div>
        <div className="text-sm text-gray-600">{config.electrons} electron{config.electrons !== 1 ? 's' : ''}</div>
      </div>
    </div>
  );
};

const ThreeDMoleculeVisualization = ({ formula = 'H2' }: { formula?: keyof typeof moleculeConfigs }) => {
  // Normalize formula (e.g., H₂ or H2 to H2)
  const normalizedFormula = formula ? formula.replace(/₂/g, "2").replace(/₃/g, "3").replace(/₄/g, "4") : "H2";
  
  // Get configuration or use H2 as default
  const config = normalizedFormula && moleculeConfigs[normalizedFormula as keyof typeof moleculeConfigs] ? 
    moleculeConfigs[normalizedFormula as keyof typeof moleculeConfigs] : 
    moleculeConfigs.H2;
    
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const frameIdRef = useRef<number | null>(null);
  
  // Element colors and radii
  const elementColors = {
    H: 0x3b82f6,
    Li: 0xec4899,
    O: 0xef4444,
    C: 0x525252,
    N: 0x0ea5e9,
  };
  
  const elementRadii = {
    H: 0.2,
    Li: 0.45,
    O: 0.4,
    C: 0.4,
    N: 0.4,
  };
  
  // Setup Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Initialize scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    sceneRef.current = scene;
    
    // Initialize camera
    const camera = new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    cameraRef.current = camera;
    
    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controlsRef.current = controls;
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Add directional light
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);
    
    // Animation loop
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      if (controlsRef.current) controlsRef.current.update();
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      cameraRef.current.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Update molecule visualization when formula changes
  useEffect(() => {
    if (!sceneRef.current) return;
    
    // Clear existing elements
    while (sceneRef.current.children.length > 0) {
      const object = sceneRef.current.children[0];
      if (object instanceof THREE.Light) {
        // Keep lights in the scene
        sceneRef.current.remove(sceneRef.current.children[sceneRef.current.children.length - 1]);
      } else {
        sceneRef.current.remove(object);
      }
    }
    
    // Add ambient and directional lights back
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    sceneRef.current.add(ambientLight);
    
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 5, 5);
    sceneRef.current.add(dirLight);
    
    const atoms: { [key: number]: THREE.Mesh } = {};
    
    // Add atoms
    config.atoms.forEach((atom, idx) => {
      const element = atom.element as keyof typeof elementColors;
      const color = elementColors[element] || 0x808080;
      const radius = elementRadii[element] || 0.3;
      
      const geometry = new THREE.SphereGeometry(radius, 32, 32);
      const material = new THREE.MeshStandardMaterial({ color, roughness: 0.3, metalness: 0.2 });
      const sphere = new THREE.Mesh(geometry, material);
      
      sphere.position.set(atom.x, atom.y, atom.z);
      sceneRef.current?.add(sphere);
      atoms[idx] = sphere;
      
      // Add element label for larger view
      const textCanvas = document.createElement('canvas');
      textCanvas.width = 64;
      textCanvas.height = 64;
      const ctx = textCanvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, 64, 64);
        ctx.fillStyle = 'black';
        ctx.font = '40px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(atom.element, 32, 32);
        
        const texture = new THREE.CanvasTexture(textCanvas);
        const labelMat = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(labelMat);
        sprite.scale.set(0.5, 0.5, 0.5);
        sprite.position.set(atom.x, atom.y + radius + 0.3, atom.z);
        sceneRef.current?.add(sprite);
      }
    });
    
    // Add bonds
    config.bonds.forEach(bond => {
      const fromAtom = atoms[bond.from];
      const toAtom = atoms[bond.to];
      
      if (fromAtom && toAtom) {
        const start = fromAtom.position;
        const end = toAtom.position;
        
        // Calculate direction and midpoint
        const direction = new THREE.Vector3().subVectors(end, start);
        const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
        
        // Create bond cylinder
        const bondGeometry = new THREE.CylinderGeometry(0.05, 0.05, direction.length(), 8);
        const bondMaterial = new THREE.MeshStandardMaterial({ color: 0x808080, roughness: 0.5 });
        const bondCylinder = new THREE.Mesh(bondGeometry, bondMaterial);
        
        // Position and rotate cylinder to connect atoms
        bondCylinder.position.copy(midpoint);
        bondCylinder.lookAt(end);
        bondCylinder.rotateX(Math.PI / 2);
        
        sceneRef.current?.add(bondCylinder);
      }
    });
    
    // Reset camera position to view the entire molecule
    if (cameraRef.current) {
      cameraRef.current.position.z = 5;
      if (controlsRef.current) controlsRef.current.update();
    }
  }, [normalizedFormula, config]);
  
  return (
    <div className="w-full h-[400px] relative">
      <div ref={containerRef} className="w-full h-full" />
      <div className="absolute bottom-2 left-2 bg-white bg-opacity-70 p-2 text-xs font-mono">
        <div>Click and drag to rotate</div>
        <div>Scroll to zoom</div>
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
  // Normalize formula
  const normalizedSystemId = systemId.replace(/₂/g, "2").replace(/₃/g, "3").replace(/₄/g, "4");
  
  // Check if it's a molecule (contains numbers or multiple elements)
  const isMolecule = systemId ? (/[0-9]/.test(normalizedSystemId) || normalizedSystemId.length > 2) : false;
  
  // Get configuration
  const config = isMolecule && moleculeConfigs[normalizedSystemId as keyof typeof moleculeConfigs] ? 
    moleculeConfigs[normalizedSystemId as keyof typeof moleculeConfigs] : null;
  
  if (!config && isMolecule) {
    return (
      <div className="border border-gray-300 p-4">
        <h3 className="text-lg font-serif mb-2">System Elements</h3>
        <p className="text-gray-500">No element information available for {systemId}</p>
      </div>
    );
  }
  
  if (!isMolecule) {
    // For single atoms
    const element = systemId as keyof typeof atomConfigs;
    const atomConfig = atomConfigs[element] || null;
    
    if (!atomConfig) {
      return (
        <div className="border border-gray-300 p-4">
          <h3 className="text-lg font-serif mb-2">System Elements</h3>
          <p className="text-gray-500">No element information available for {systemId}</p>
        </div>
      );
    }
    
    return (
      <div className="border border-gray-300 p-4">
        <h3 className="text-lg font-serif mb-2">System Elements</h3>
        <div className="p-2 border border-gray-200 mb-2 flex items-center">
          <div className="w-8 h-8 rounded-full mr-2" style={{ backgroundColor: atomConfig.color }}></div>
          <div>
            <span className="font-mono">{element}</span> - <span>{atomConfig.name}</span>
          </div>
        </div>
      </div>
    );
  }
  
  // For molecules
  return (
    <div className="border border-gray-300 p-4">
      <h3 className="text-lg font-serif mb-2">System Elements</h3>
      {config && config.atoms && config.atoms.map((atom: { element: string }, idx: number) => {
        const element = atom.element as keyof typeof atomConfigs;
        const atomConfig = atomConfigs[element] || null;
        
        if (!atomConfig) return null;
        
        return (
          <div key={`element-${idx}`} className="p-2 border border-gray-200 mb-2 flex items-center">
            <div className="w-6 h-6 rounded-full mr-2" style={{ backgroundColor: atomConfig.color }}></div>
            <div>
              <span className="font-mono">{element}</span> - <span>{atomConfig.name}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const SystemPropertiesBox = ({ systemId }: { systemId: string }) => {
  // Normalize formula
  const normalizedSystemId = systemId.replace(/₂/g, "2").replace(/₃/g, "3").replace(/₄/g, "4");
  
  // Check if it's a molecule (contains numbers or multiple elements)
  const isMolecule = systemId ? (/[0-9]/.test(normalizedSystemId) || normalizedSystemId.length > 2) : false;
  
  if (isMolecule) {
    // Get molecule configuration
    const config = moleculeConfigs[normalizedSystemId as keyof typeof moleculeConfigs] || null;
    
    if (!config) {
      return (
        <div className="border border-gray-300 p-4">
          <h3 className="text-lg font-serif mb-2">System Properties</h3>
          <p className="text-gray-500">No property information available</p>
        </div>
      );
    }
    
    return (
      <div className="border border-gray-300 p-4">
        <h3 className="text-lg font-serif mb-2">System Properties</h3>
        <table className="w-full text-sm font-mono">
          <tbody>
            {config.properties && Object.entries(config.properties).map(([key, value]) => (
              <tr key={key} className="border-b border-gray-200">
                <td className="py-2 pr-2 font-semibold">{key.replace('_', ' ')}</td>
                <td className="py-2">{value}</td>
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
        <div className="border border-gray-300 p-4">
          <h3 className="text-lg font-serif mb-2">System Properties</h3>
          <p className="text-gray-500">No property information available</p>
        </div>
      );
    }
    
    return (
      <div className="border border-gray-300 p-4">
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
      <div className="flex items-center justify-center h-64 text-lg text-gray-500">
        Select a quantum system to visualize
      </div>
    );
  }
  
  return (
    <div className="flex flex-col space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left column: Selected system info */}
        <div className="md:col-span-1 space-y-4">
          <SystemElementsBox systemId={systemId} />
          <SystemPropertiesBox systemId={systemId} />
        </div>
        
        {/* Right column: Visualization */}
        <div className="md:col-span-2 border border-gray-300 p-4">
          <h3 className="text-lg font-serif mb-2">System Visualization</h3>
          
          {/* Visualization tabs */}
          <div className="mb-4">
            {isMolecule ? (
              <div className="flex flex-col">
                <h4 className="text-md font-serif mb-2">3D Molecular Structure</h4>
                <ThreeDMoleculeVisualization formula={systemId as keyof typeof moleculeConfigs} />
                
                <h4 className="text-md font-serif mt-6 mb-2">Individual Atom Structures</h4>
                <div className="grid grid-cols-2 gap-4">
                  {/* Get unique elements from molecule */}
                  {Array.from(new Set((moleculeConfigs[systemId as keyof typeof moleculeConfigs]?.atoms || [])
                    .map(atom => atom.element)))
                    .map(element => (
                      <div key={element} className="border border-gray-200 p-2">
                        <AtomVisualization element={element as keyof typeof atomConfigs} />
                      </div>
                    ))
                  }
                </div>
              </div>
            ) : (
              <AtomVisualization element={systemId as keyof typeof atomConfigs} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuantumVisualizationComponent;