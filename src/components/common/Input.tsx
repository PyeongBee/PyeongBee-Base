import React from 'react';

// Input 관련 컴포넌트들
interface InputGroupProps {
  children: React.ReactNode;
  className?: string;
}

export const InputGroup: React.FC<InputGroupProps> = ({ children, className = '' }) => (
  <div className={`flex items-center gap-4 flex-1 min-w-[300px] ${className}`}>
    {children}
  </div>
);

interface InputLabelProps {
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
}

export const InputLabel: React.FC<InputLabelProps> = ({ children, htmlFor, className = '' }) => (
  <label 
    htmlFor={htmlFor}
    className={`text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap ${className}`}
  >
    {children}
  </label>
);

interface InputFieldProps {
  type?: 'text' | 'number' | 'email' | 'password';
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  min?: number;
  max?: number;
  step?: number;
}

export const InputField: React.FC<InputFieldProps> = ({ 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  className = '', 
  id,
  min,
  max,
  step
}) => (
  <input
    id={id}
    type={type}
    className={`flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
               dark:bg-gray-700 dark:text-white ${className}`}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    min={min}
    max={max}
    step={step}
  />
);

export { InputGroup, InputLabel, InputField };
