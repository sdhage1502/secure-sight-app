'use client';

import { useState } from 'react';
import { 
  Grid3X3, 
  Camera, 
  PlayCircle, 
  AlertTriangle, 
  Users, 
  Menu,
  X
} from 'lucide-react';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { icon: Grid3X3, label: 'Dashboard', active: true },
    { icon: Camera, label: 'Cameras' },
    { icon: PlayCircle, label: 'Scenes' },
    { icon: AlertTriangle, label: 'Incidents' },
    { icon: Users, label: 'Users' },
  ];

  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className="px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-orange-500 p-2 rounded">
              <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
                <span className="text-orange-500 font-bold text-sm">M</span>
              </div>
            </div>
            <span className="text-white font-semibold text-lg">MANDLACX</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <button
                key={index}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  item.active 
                    ? 'bg-orange-500 text-white' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <item.icon size={18} />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* User Profile */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-3">
              <div className="text-right">
                <div className="text-white text-sm font-medium">Mohammed Ajhas</div>
                <div className="text-gray-400 text-xs">ajhas@mandlac.com</div>
              </div>
              <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">MA</span>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-700">
            <nav className="space-y-2">
              {navItems.map((item, index) => (
                <button
                  key={index}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    item.active 
                      ? 'bg-orange-500 text-white' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
            
            {/* Mobile User Profile */}
            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="flex items-center space-x-3 px-4">
                <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">MA</span>
                </div>
                <div>
                  <div className="text-white font-medium">Mohammed Ajhas</div>
                  <div className="text-gray-400 text-sm">ajhas@mandlac.com</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}