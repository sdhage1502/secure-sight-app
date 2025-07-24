'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gradient-start to-gradient-end flex items-center justify-center">
      <div className="text-center bg-black bg-opacity-80 rounded-dashboard shadow-dashboard p-8 w-full max-w-md mx-auto">
        <h1 className="dashboard-header text-4xl font-extrabold mb-4">Welcome to SecureSight</h1>
        <p className="text-lg mb-6 text-gray-300">
          Monitor and manage your CCTV incidents with ease.
        </p>
        <Link href="/dashboard" className="px-6 py-3 bg-gradient-to-r from-gradient-start to-gradient-end text-white rounded-dashboard font-semibold shadow-lg hover:scale-105 transition-transform duration-200">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}