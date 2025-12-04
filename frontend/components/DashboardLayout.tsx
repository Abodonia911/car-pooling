'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Navbar from './Navbar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  requiredRole?: 'ADMIN' | 'DRIVER' | 'PASSENGER';
}

export default function DashboardLayout({ children, requiredRole }: DashboardLayoutProps) {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    } else if (requiredRole && user?.role !== requiredRole) {
      // Redirect to appropriate dashboard
      if (user?.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else if (user?.role === 'DRIVER') {
        router.push('/driver/dashboard');
      } else {
        router.push('/passenger/dashboard');
      }
    }
  }, [isAuthenticated, user, requiredRole, router]);

  if (!isAuthenticated || (requiredRole && user?.role !== requiredRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
