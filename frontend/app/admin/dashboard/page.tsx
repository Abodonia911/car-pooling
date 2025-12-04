'use client';

import { useQuery, useMutation } from '@apollo/client';
import { GET_ALL_USERS_QUERY, APPROVE_DRIVER_MUTATION, REJECT_DRIVER_MUTATION } from '@/lib/graphql/user.graphql';
import { ALL_BOOKINGS_QUERY } from '@/lib/graphql/booking.graphql';
import DashboardLayout from '@/components/DashboardLayout';
import { useState } from 'react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'users' | 'bookings'>('users');

  const { data: usersData, loading: usersLoading, refetch: refetchUsers } = useQuery(GET_ALL_USERS_QUERY, {
    context: { service: 'user' },
  });

  const { data: bookingsData, loading: bookingsLoading } = useQuery(ALL_BOOKINGS_QUERY, {
    context: { service: 'booking' },
  });

  const [approveDriver] = useMutation(APPROVE_DRIVER_MUTATION, {
    context: { service: 'user' },
    onCompleted: () => {
      refetchUsers();
      alert('Driver approved successfully');
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    },
  });

  const [rejectDriver] = useMutation(REJECT_DRIVER_MUTATION, {
    context: { service: 'user' },
    onCompleted: () => {
      refetchUsers();
      alert('Driver rejected successfully');
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    },
  });

  const handleApprove = (userId: string) => {
    if (confirm('Are you sure you want to approve this driver?')) {
      approveDriver({ variables: { userId } });
    }
  };

  const handleReject = (userId: string) => {
    if (confirm('Are you sure you want to reject this driver?')) {
      rejectDriver({ variables: { userId } });
    }
  };

  return (
    <DashboardLayout requiredRole="ADMIN">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage users and view system statistics</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('users')}
              className={`${
                activeTab === 'users'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              User Management
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`${
                activeTab === 'bookings'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              All Bookings
            </button>
          </nav>
        </div>

        {/* User Management Tab */}
        {activeTab === 'users' && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">All Users</h2>
            {usersLoading ? (
              <p>Loading users...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        University ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Verified
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {usersData?.getAllUsers.map((user: any) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {user.fullName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.universityId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.role === 'ADMIN'
                                ? 'bg-purple-100 text-purple-800'
                                : user.role === 'DRIVER'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.isEmailVerified ? (
                            <span className="text-green-600">✓ Verified</span>
                          ) : (
                            <span className="text-red-600">✗ Not Verified</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          {user.role === 'DRIVER' && !user.isEmailVerified && (
                            <>
                              <button
                                onClick={() => handleApprove(user.id)}
                                className="text-green-600 hover:text-green-900"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject(user.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">All Bookings</h2>
            {bookingsLoading ? (
              <p>Loading bookings...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Booking ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ride ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Passenger ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Destination
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created At
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bookingsData?.allBookings.map((booking: any) => (
                      <tr key={booking.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {booking.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {booking.rideId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {booking.passengerId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {booking.destination}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(booking.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
