import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'burgundy' | 'accent';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  className = '',
}) => {
  const variantStyles = {
    primary: 'bg-neutral-900 text-white',
    secondary: 'bg-neutral-100 text-neutral-800',
    outline: 'border border-neutral-300 text-neutral-700 bg-white',
    danger: 'bg-red-50 text-red-700 border border-red-200',
    burgundy: 'bg-[#721b29] text-white font-bold',
    accent: 'bg-amber-100 text-amber-900 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[10px] tracking-tight font-medium ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
