import React from "react";

interface ModeButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  role?: string;
  "aria-selected"?: boolean;
  "aria-controls"?: string;
  tabIndex?: number;
}

export const ModeButton: React.FC<ModeButtonProps> = React.memo(
  ({ active, onClick, children, className = "", ...props }) => {
    return (
      <button
        className={`
        px-4 py-1 border-2 text-white rounded-full
        font-medium transition-all duration-200 
        hover:bg-white/10 hover:border-white/50
        focus:outline-none focus:ring-2 focus:ring-white/50
        ${
          active
            ? "bg-amber-800 border-amber-800"
            : "bg-transparent border-white/30"
        }
        ${className}
      `}
        onClick={onClick}
        {...props}
      >
        {children}
      </button>
    );
  }
);

export default ModeButton;
