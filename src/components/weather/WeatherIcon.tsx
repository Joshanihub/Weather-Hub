import React from 'react';
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  CloudDrizzle,
  Zap
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface WeatherIconProps {
  condition: string;
  isDay?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({
  condition,
  isDay = true,
  size = 'md',
  className
}) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  const iconColor = isDay 
    ? 'text-weather-sunny' 
    : 'text-surface-600';

  const normalizedCondition = condition.toLowerCase();
  
  if (normalizedCondition.includes('sun') || normalizedCondition.includes('clear')) {
    return <Sun className={cn(sizes[size], iconColor, className)} />;
  }
  if (normalizedCondition.includes('cloud')) {
    return <Cloud className={cn(sizes[size], iconColor, className)} />;
  }
  if (normalizedCondition.includes('rain') || normalizedCondition.includes('shower')) {
    return <CloudRain className={cn(sizes[size], iconColor, className)} />;
  }
  if (normalizedCondition.includes('snow')) {
    return <CloudSnow className={cn(sizes[size], iconColor, className)} />;
  }
  if (normalizedCondition.includes('drizzle')) {
    return <CloudDrizzle className={cn(sizes[size], iconColor, className)} />;
  }
  if (normalizedCondition.includes('thunder') || normalizedCondition.includes('storm')) {
    return <Zap className={cn(sizes[size], iconColor, className)} />;
  }
  
  return <Cloud className={cn(sizes[size], iconColor, className)} />;
};

export default WeatherIcon;
