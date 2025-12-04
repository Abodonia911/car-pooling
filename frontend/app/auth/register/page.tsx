'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { REGISTER_MUTATION } from '@/lib/graphql/user.graphql';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    universityId: '',
    role: 'PASSENGER' as 'DRIVER' | 'PASSENGER',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const [registerMutation, { loading }] = useMutation(REGISTER_MUTATION, {
    context: { service: 'user' },
    onCompleted: () => {
      setSuccess(true);
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    },
    onError: (error) => {
      setError(error.message || 'Registration failed');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await registerMutation({
        variables: {
          data: formData,
        },
      });
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-medium text-primary-600 hover:text-primary-500">
              Sign in
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="fullName" className="label">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                className="input-field"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="email" className="label">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="input-field"
                placeholder="john@university.edu"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="universityId" className="label">
                University ID
              </label>
              <input
                id="universityId"
                name="universityId"
                type="text"
                required
                className="input-field"
                placeholder="STU123456"
                value={formData.universityId}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="input-field"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="role" className="label">
                I want to register as
              </label>
              <select
                id="role"
                name="role"
                required
                className="input-field"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="PASSENGER">Passenger</option>
                <option value="DRIVER">Driver</option>
              </select>
              <p className="mt-1 text-sm text-gray-500">
                {formData.role === 'DRIVER'
                  ? 'Driver accounts require admin approval'
                  : 'Passenger accounts are activated immediately'}
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded">
              Registration successful! Redirecting to login...
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading || success}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
