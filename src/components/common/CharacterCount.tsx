import React from 'react';
import { CharacterCountProps } from '../../types/editor';
import { formatNumber } from '../../utils/textUtils';

interface CharacterCountComponentProps extends CharacterCountProps {
  showCopyButton?: boolean;
  onCopy?: () => void;
  copyButtonText?: string;
  copySuccessText?: string;
  isCopied?: boolean;
}

const CharacterCount: React.FC<CharacterCountComponentProps> = React.memo(({
  characterCount,
  wordCount,
  lineCount,
  isOverLimit,
  showCopyButton = false,
  onCopy,
  copyButtonText = '📋',
  copySuccessText = '✓',
  isCopied = false
}) => {
  return (
    <div className="flex gap-4 text-sm">
      <div className={`flex items-center gap-1 ${isOverLimit ? 'text-red-600 dark:text-red-400' : ''}`}>
        <span className="text-gray-600 dark:text-gray-400">글자수:</span>
        <span className="font-medium text-gray-900 dark:text-white">
          {formatNumber(characterCount)}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-gray-600 dark:text-gray-400">단어수:</span>
        <span className="font-medium text-gray-900 dark:text-white">{formatNumber(wordCount)}</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-gray-600 dark:text-gray-400">줄수:</span>
        <span className="font-medium text-gray-900 dark:text-white">{formatNumber(lineCount)}</span>
      </div>
      {showCopyButton && onCopy && (
        <button 
          className={`
            ml-2 px-2 py-1 text-xs rounded transition-all duration-200
            ${isCopied 
              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300'
            }
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
          `}
          onClick={onCopy}
          title={isCopied ? "복사됨!" : "결과 복사"}
          aria-label={isCopied ? "복사됨!" : "결과 복사"}
        >
          {isCopied ? copySuccessText : copyButtonText}
        </button>
      )}
    </div>
  );
});

export default CharacterCount;

// Button 컴포넌트 추가
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = React.memo(({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '',
  onClick,
  disabled = false,
  type = 'button'
}) => {
  const baseClasses = 'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-500 dark:text-gray-400 dark:hover:bg-gray-800'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  return (
    <button 
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
});

// ModeButton 컴포넌트 추가 (에디터 모드 버튼용)
interface ModeButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  role?: string;
  'aria-selected'?: boolean;
  'aria-controls'?: string;
  tabIndex?: number;
}

export const ModeButton: React.FC<ModeButtonProps> = React.memo(({ 
  active, 
  onClick, 
  children, 
  className = '',
  ...props 
}) => {
  return (
    <button 
      className={`
        px-6 py-3 border-2 bg-transparent text-white rounded-full
        font-medium transition-all duration-200 
        hover:bg-white/10 hover:border-white/50
        focus:outline-none focus:ring-2 focus:ring-white/50
        ${active 
          ? 'bg-amber-800 border-amber-800' 
          : 'border-white/30'
        }
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
});
