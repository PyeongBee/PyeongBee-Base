import React from "react";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  size = "md",
  className = "",
}) => {
  const sizeClasses = {
    sm: "w-8 h-4",
    md: "w-12 h-6",
    lg: "w-16 h-8",
  };

  const thumbSizeClasses = {
    sm: "w-3 h-3",
    md: "w-5 h-5",
    lg: "w-7 h-7",
  };

  const thumbTranslateClasses = {
    sm: checked ? "translate-x-4" : "translate-x-0",
    md: checked ? "translate-x-6" : "translate-x-0",
    lg: checked ? "translate-x-8" : "translate-x-0",
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {label && (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {label}
        </span>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`
           relative inline-flex items-center rounded-full transition-colors duration-200 ease-in-out p-0.5
           focus:outline-none
           ${sizeClasses[size]}
           ${
             checked
               ? "bg-gradient-to-r from-amber-400 to-amber-500"
               : "bg-gray-300 dark:bg-gray-600"
           }
           ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
         `}
      >
        <span
          className={`
            inline-block rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out
            ${thumbSizeClasses[size]}
            ${thumbTranslateClasses[size]}
          `}
        />
      </button>
    </div>
  );
};

export default ToggleSwitch;
