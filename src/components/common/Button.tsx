import React from "react";
import { getButtonClasses, type ButtonVariant, type ButtonSize } from "@/styles/components";

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export const Button: React.FC<ButtonProps> = React.memo(
  function Button({
    variant = "default",
    size = "md",
    children,
    className,
    onClick,
    disabled = false,
    type = "button",
  }) {
    return (
      <button
        type={type}
        className={getButtonClasses(variant, size, className)}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    );
  }
);

export default Button;
