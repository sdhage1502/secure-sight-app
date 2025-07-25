'use client';

import { useState } from 'react';
import { 
  Grid3X3, 
  Camera, 
  PlayCircle, 
  AlertTriangle, 
  Users, 
  Menu,
  X,
  LogOut
} from 'lucide-react';

// Mock user data and logout function
const user = {
  name: 'Shreyash Dhage',
  email: 'shreyash@example.com',
};
const logout = () => alert('Logged out');

// Helper function to generate user initials
const getUserInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};

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
                <div className="text-white text-sm font-medium">{user.name}</div>
                <div className="text-gray-400 text-xs">{user.email}</div>
              </div>
              <button
                onClick={logout}
                className="relative group w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-500 transition-colors"
                title="Click to logout"
              >
                <span className="text-white font-medium group-hover:opacity-0 transition-opacity">
                  {getUserInitials(user.name)}
                </span>
                <LogOut 
                  size={16} 
                  className="text-white absolute opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </button>
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
              <div className="flex items-center justify-between px-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">{getUserInitials(user.name)}</span>
                  </div>
                  <div>
                    <div className="text-white font-medium">{user.name}</div>
                    <div className="text-gray-400 text-sm">{user.email}</div>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
