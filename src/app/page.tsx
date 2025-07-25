'use client';

import Link from 'next/link';
import { useTheme } from './context/ThemeContext';
import { Sun, Moon, Shield } from 'lucide-react';

export default function Home() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-900 dark:to-black">
      {/* Header */}
      <header className="bg-white/80 dark:bg-black/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-[#FF4500] to-[#FF8C00] rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">SecureSight</h1>
            </div>

            {/* Navigation */}
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-[#FF4500] dark:hover:text-[#FF4500] font-medium transition-colors duration-200"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-6 py-2 bg-gradient-to-r from-[#FF4500] to-[#FF8C00] text-white font-semibold rounded-lg hover:from-[#E03E00] hover:to-[#E67E00] transition-all duration-200"
              >
                Sign Up
              </Link>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                ) : (
                  <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
        <div className="text-center max-w-2xl mx-auto">
          {/* Hero Icon */}
          <div className="mx-auto w-24 h-24 bg-gradient-to-r from-[#FF4500] to-[#FF8C00] rounded-full flex items-center justify-center mb-8">
            <Shield className="w-12 h-12 text-white" />
          </div>

          {/* Hero Text */}
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4500] to-[#FF8C00]">SecureSight</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            Your comprehensive security monitoring solution. Monitor and manage your surveillance systems with ease and confidence.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="px-8 py-4 bg-gradient-to-r from-[#FF4500] to-[#FF8C00] text-white font-semibold rounded-lg hover:from-[#E03E00] hover:to-[#E67E00] focus:ring-2 focus:ring-[#FF4500] focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-black transition-all duration-200 shadow-lg"
            >
              Access Dashboard
            </Link>
            <Link
              href="/signup"
              className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-2 focus:ring-[#FF4500] focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-black transition-all duration-200 shadow-lg"
            >
              Create Account
            </Link>
          </div>

          {/* Features */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-[#FF4500] to-[#FF8C00] rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Secure Monitoring</h3>
              <p className="text-gray-600 dark:text-gray-400">Advanced security features to keep your surveillance data safe</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-[#FF4500] to-[#FF8C00] rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Real-time Alerts</h3>
              <p className="text-gray-600 dark:text-gray-400">Instant notifications for important security events</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-[#FF4500] to-[#FF8C00] rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Easy Management</h3>
              <p className="text-gray-600 dark:text-gray-400">Intuitive interface for managing all your security systems</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
