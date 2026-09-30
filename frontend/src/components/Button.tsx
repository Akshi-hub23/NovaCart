import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  variant?: "primary" | "secondary" | "outline" | "danger";
  style?: React.CSSProperties;
}

function Button({
  children,
  type = "button",
  onClick,
  disabled = false,
  className = "",
  variant = "primary",
  style,
}: ButtonProps) {
  const baseClass = `btn btn-${variant}${className ? ` ${className}` : ""}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseClass}
      style={style}
    >
      {children}
    </button>
  );
}

export default Button;