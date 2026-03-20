import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'weather' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  className,
  children,
  ...props
}) => {
  const baseStyles = 'rounded-2xl transition-all duration-300';
  
  const variants = {
    default: 'bg-white border border-surface-200 shadow-soft hover:shadow-medium',
    glass: 'glass-card',
    weather: 'weather-card',
    elevated: 'bg-white shadow-medium hover:shadow-strong border-0',
  };
  
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={cn(
        baseStyles,
        variants[variant],
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
