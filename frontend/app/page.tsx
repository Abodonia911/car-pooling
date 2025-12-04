'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect based on role
      if (user.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else if (user.role === 'DRIVER') {
        router.push('/driver/dashboard');
      } else if (user.role === 'PASSENGER') {
        router.push('/passenger/dashboard');
      }
    }
  }, [isAuthenticated, user, router]);

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              University Car Pooling
            </h1>
            <p className="text-xl mb-8 text-primary-100">
              Share rides, save money, and reduce your carbon footprint
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/auth/register" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors">
                Get Started
              </Link>
              <Link href="/auth/login" className="bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors border-2 border-white">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Sign Up</h3>
            <p className="text-gray-600">Create an account as a driver or passenger</p>
          </div>
          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Find Rides</h3>
            <p className="text-gray-600">Search for available rides or post your own</p>
          </div>
          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Book & Go</h3>
            <p className="text-gray-600">Book your seat and enjoy the ride</p>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Why Choose Car Pooling?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-600 text-white">
                  💰
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-800">Save Money</h3>
                <p className="mt-2 text-gray-600">Share fuel costs and reduce your transportation expenses</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-600 text-white">
                  🌱
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-800">Eco-Friendly</h3>
                <p className="mt-2 text-gray-600">Reduce your carbon footprint by sharing rides</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-600 text-white">
                  👥
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-800">Meet People</h3>
                <p className="mt-2 text-gray-600">Connect with fellow students from your university</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-600 text-white">
                  🔒
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-800">Safe & Secure</h3>
                <p className="mt-2 text-gray-600">Verified university students only</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 University Car Pooling. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
