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
    primary: 'bg-cyan-950 text-cyan-300 border border-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.4)]',
    secondary: 'bg-pink-950 text-pink-300 border border-pink-500 shadow-[0_0_8px_rgba(255,0,127,0.4)]',
    outline: 'border border-cyan-500/40 text-cyan-300 bg-black/60',
    danger: 'bg-red-950 text-red-300 border border-red-500',
    burgundy: 'bg-[#ff007f] text-black font-black shadow-[0_0_10px_rgba(255,0,127,0.6)]',
    accent: 'bg-yellow-950 text-yellow-300 border border-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.4)]',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[10px] tracking-tight font-mono font-bold rounded ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
