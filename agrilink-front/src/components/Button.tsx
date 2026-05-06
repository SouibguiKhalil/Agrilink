import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md',
  children, 
  className = '',
  disabled,
  ...props 
}) => {
  const baseStyles = 'rounded-lg transition-all duration-200 font-medium inline-flex items-center justify-center gap-2';
  
  const variantStyles = {
    primary: 'bg-[#386641] text-white hover:bg-[#6A994E] disabled:bg-gray-300 disabled:cursor-not-allowed shadow-sm',
    secondary: 'bg-[#BC4749] text-white hover:bg-[#9d393b] disabled:bg-gray-300 disabled:cursor-not-allowed shadow-sm',
    ghost: 'bg-transparent text-[#386641] hover:bg-[#F2E8CF] disabled:opacity-50 disabled:cursor-not-allowed',
    outline: 'bg-transparent text-[#386641] hover:bg-[#F2E8CF] border border-[#386641] disabled:opacity-50 disabled:cursor-not-allowed'
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5',
    lg: 'px-7 py-3.5 text-lg'
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
