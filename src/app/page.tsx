'use client';

import React, { useState, useEffect } from 'react';
// Import components
import Welcome from '../components/welcome';
import QuantumSystemSelection from '../components/selection';
import DetailedQuantumSelection from '../components/detail';
import ExperimentConfig from '../components/config';
import Results from '../components/results';
import Publishing from '../components/publishing';
import { QuantumProvider } from '../components/context';

export default function Home() {
  const [currentSection, setCurrentSection] = useState('welcome');
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState('forward');
  const [prevSection, setPrevSection] = useState<string | null>(null);

  // Updated sections array to include publishing
  const sections = ['welcome', 'quantum-system', 'detailed-quantum', 'experiment-config', 'results', 'publishing'];

  // Debug navigation changes
  useEffect(() => {
    console.log(`Navigation: ${prevSection || 'initial'} -> ${currentSection}`);
  }, [currentSection, prevSection]);

  const navigateTo = (section: string) => {
    if (animating) {
      console.log("Animation in progress, ignoring navigation request");
      return;
    }
    
    // Ensure section is one of the valid sections
    if (!sections.includes(section)) {
      console.error(`Invalid section: ${section}. Must be one of: ${sections.join(', ')}`);
      return;
    }
    
    // Determine direction based on section order
    const currentIndex = sections.indexOf(currentSection);
    const nextIndex = sections.indexOf(section);
    const newDirection = nextIndex > currentIndex ? 'forward' : 'backward';
    
    console.log(`Starting navigation from ${currentSection} to ${section} (${newDirection})`);
    
    setDirection(newDirection);
    setAnimating(true);
    setPrevSection(currentSection);
    
    // Set a shorter timeout for faster transitions
    setTimeout(() => {
      setCurrentSection(section);
      setTimeout(() => {
        setAnimating(false);
        console.log("Animation complete");
      }, 300); // Reduced from 400
    }, 200); // Reduced from 300
  };

  // Helper function to determine section classes
  const getSectionClasses = (sectionName: string) => {
    const baseClasses = "h-full w-full absolute top-0 left-0 right-0 transition-all duration-300 ease-in-out overflow-hidden";
    
    if (currentSection === sectionName) {
      return `${baseClasses} opacity-100 translate-x-0 z-10`;
    }
    
    const currentIndex = sections.indexOf(currentSection);
    const sectionIndex = sections.indexOf(sectionName);
    
    if (direction === 'forward') {
      if (sectionIndex < currentIndex) {
        return `${baseClasses} opacity-0 -translate-x-full z-0 pointer-events-none`;
      } else {
        return `${baseClasses} opacity-0 translate-x-full z-0 pointer-events-none`;
      }
    } else { // backward
      if (sectionIndex > currentIndex) {
        return `${baseClasses} opacity-0 translate-x-full z-0 pointer-events-none`;
      } else {
        return `${baseClasses} opacity-0 -translate-x-full z-0 pointer-events-none`;
      }
    }
  };

  return (
    <QuantumProvider>
      <main className="h-screen w-full bg-white text-black relative font-sans overflow-hidden">
        {/* Welcome Section */}
        <section className={getSectionClasses('welcome')}>
          <Welcome onNavigate={navigateTo} />
        </section>

        {/* Quantum System Selection Section */}
        <section className={getSectionClasses('quantum-system')}>
          <QuantumSystemSelection onNavigate={navigateTo} />
        </section>

        {/* Detailed Quantum Selection Section */}
        <section className={getSectionClasses('detailed-quantum')}>
          <DetailedQuantumSelection onNavigate={navigateTo} />
        </section>

        {/* Experiment Configuration Section */}
        <section className={getSectionClasses('experiment-config')}>
          <ExperimentConfig onNavigate={navigateTo} />
        </section>

        {/* Results Section */}
        <section className={getSectionClasses('results')}>
          <Results onNavigate={navigateTo} />
        </section>
        
        {/* Publishing Section - New */}
        <section className={getSectionClasses('publishing')}>
          <Publishing onNavigate={navigateTo} />
        </section>
      </main>
    </QuantumProvider>
  );
}