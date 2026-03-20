import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Search, 
  Map, 
  Bookmark, 
  Settings,
  Cloud,
  Sun,
  CloudRain
} from 'lucide-react';
import { cn } from '../../utils/cn';

const Navigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/search', label: 'Search', icon: Search },
    { path: '/forecast', label: 'Forecast', icon: Cloud },
    { path: '/map', label: 'Map', icon: Map },
    { path: '/saved', label: 'Saved', icon: Bookmark },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-surface-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Sun className="h-8 w-8 text-weather-sunny group-hover:rotate-180 transition-transform duration-500" />
              <CloudRain className="h-4 w-4 text-weather-rainy absolute -bottom-1 -right-1" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              WeatherHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'nav-link flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200',
                    isActive 
                      ? 'text-primary-600 bg-primary-50' 
                      : 'hover:bg-surface-100'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="p-2 rounded-lg text-surface-600 hover:text-primary-600 hover:bg-surface-100 transition-colors">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-surface-200/50">
        <div className="px-2 py-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200',
                  isActive 
                    ? 'text-primary-600 bg-primary-50' 
                    : 'text-surface-600 hover:text-primary-600 hover:bg-surface-100'
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
