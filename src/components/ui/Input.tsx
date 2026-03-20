import React, { useId } from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  containerClassName?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  containerClassName,
  className,
  id,
  ...props
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className={cn('space-y-2', containerClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-surface-700"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="text-surface-400">{icon}</div>
          </div>
        )}
        <input
          id={inputId}
          className={cn(
            'input-field',
            icon && 'pl-10',
            error && 'border-red-300 focus:ring-red-500',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input;
