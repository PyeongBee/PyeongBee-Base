import React from 'react';

interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ children, className = '' }) => (
  <h1 className={`text-4xl font-bold text-gray-900 dark:text-white mb-4 ${className}`}>
    {children}
  </h1>
);

interface SectionDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export const SectionDescription: React.FC<SectionDescriptionProps> = ({ children, className = '' }) => (
  <p className={`text-lg text-gray-600 dark:text-gray-400 ${className}`}>
    {children}
  </p>
);
