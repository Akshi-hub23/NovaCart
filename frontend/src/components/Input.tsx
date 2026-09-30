import React from "react";

interface InputProps {
  type?: string;
  value?: string | number;
  placeholder?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  id?: string;
  disabled?: boolean;
  required?: boolean;
  autoComplete?: string;
  "aria-label"?: string;
  className?: string;
  style?: React.CSSProperties;
  min?: number;
  max?: number;
  step?: number;
}

function Input({
  type = "text",
  value,
  placeholder,
  onChange,
  name,
  id,
  disabled = false,
  required = false,
  autoComplete,
  "aria-label": ariaLabel,
  className = "",
  style,
  min,
  max,
  step,
}: InputProps) {
  const inputClass = `form-control${className ? ` ${className}` : ""}`;

  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      name={name}
      id={id}
      disabled={disabled}
      required={required}
      autoComplete={autoComplete}
      aria-label={ariaLabel}
      className={inputClass}
      style={style}
      min={min}
      max={max}
      step={step}
    />
  );
}

export default Input;
