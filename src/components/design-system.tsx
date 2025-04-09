// src/components/design-system.tsx
import React from 'react';

// Button component with design system applied
export const Button = ({ 
  children, 
  variant = 'primary',
  onClick, 
  disabled = false,
  className = ''
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) => {
  const baseStyles = "px-6 py-2 transition-colors font-medium";
  
  const variantStyles = {
    primary: "bg-black text-white hover:bg-gray-800 border border-black",
    secondary: "bg-gray-200 hover:bg-gray-300 text-black border border-black",
    outline: "border border-black hover:bg-gray-100 text-black"
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

// Card component for consistent container styling
export const Card = ({
  children,
  className = '',
  onClick
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <div 
      className={`border border-black p-6 bg-white ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

// Section title component
export const SectionTitle = ({
  title,
  subtitle
}: {
  title: string;
  subtitle?: string;
}) => {
  return (
    <div className="flex justify-between items-center mb-4 border-b border-black pb-2">
      <h2 className="text-2xl font-serif">{title}</h2>
      {subtitle && <div className="text-lg font-mono bg-black text-white px-3 py-1">{subtitle}</div>}
    </div>
  );
};

// Selector button for options selection
export const SelectorButton = ({
  children,
  selected,
  onClick,
  disabled = false
}: {
  children: React.ReactNode;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}) => {
  return (
    <button
      className={`border ${selected ? 'bg-black text-white' : 'border-black'} p-4 transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

// Page layout with consistent padding and size
export const PageLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="h-screen w-full flex flex-col">
      <div className="flex-1 px-4 py-4 mx-auto w-full overflow-hidden">
        {children}
      </div>
    </div>
  );
};

// Footer navigation (back/next buttons)
export const NavigationFooter = ({
  onBack,
  onNext,
  nextLabel = "Next",
  backLabel = "Back",
  nextDisabled = false
}: {
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
  backLabel?: string;
  nextDisabled?: boolean;
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-between items-center bg-white py-3 px-6 border-t border-black z-50">
      <Button variant="secondary" onClick={onBack} className="min-w-[120px]">
        {backLabel}
      </Button>
      <Button variant="primary" onClick={onNext} disabled={nextDisabled} className="min-w-[120px]">
        {nextLabel}
      </Button>
    </div>
  );
};