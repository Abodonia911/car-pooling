'use client';

import { useQuery, useMutation } from '@apollo/client';
import { CREATE_RIDE_MUTATION, DRIVER_RIDES_QUERY } from '@/lib/graphql/ride.graphql';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/lib/auth-context';
import { useState } from 'react';

export default function DriverDashboard() {
  const { user } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    date: '',
    availableSeats: 1,
  });

  const { data, loading, refetch } = useQuery(DRIVER_RIDES_QUERY, {
    context: { service: 'ride' },
    variables: { userId: user?.id },
    skip: !user?.id,
  });

  const [createRide, { loading: creating }] = useMutation(CREATE_RIDE_MUTATION, {
    context: { service: 'ride' },
    onCompleted: () => {
      refetch();
      setShowCreateForm(false);
      setFormData({ origin: '', destination: '', date: '', availableSeats: 1 });
      alert('Ride created successfully!');
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createRide({
      variables: {
        data: {
          driverId: user?.id,
          origin: formData.origin,
          destination: formData.destination,
          date: new Date(formData.date).toISOString(),
          availableSeats: Number(formData.availableSeats),
        },
      },
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <DashboardLayout requiredRole="DRIVER">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Driver Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your rides</p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="btn-primary"
          >
            {showCreateForm ? 'Cancel' : 'Create New Ride'}
          </button>
        </div>

        {/* Create Ride Form */}
        {showCreateForm && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Create New Ride</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="origin" className="label">
                    Origin
                  </label>
                  <input
                    type="text"
                    id="origin"
                    name="origin"
                    required
                    className="input-field"
                    placeholder="Starting location"
                    value={formData.origin}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="destination" className="label">
                    Destination
                  </label>
                  <input
                    type="text"
                    id="destination"
                    name="destination"
                    required
                    className="input-field"
                    placeholder="Where are you going?"
                    value={formData.destination}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="date" className="label">
                    Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    id="date"
                    name="date"
                    required
                    className="input-field"
                    value={formData.date}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="availableSeats" className="label">
                    Available Seats
                  </label>
                  <input
                    type="number"
                    id="availableSeats"
                    name="availableSeats"
                    required
                    min="1"
                    max="8"
                    className="input-field"
                    value={formData.availableSeats}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={creating}
                className="btn-primary disabled:opacity-50"
              >
                {creating ? 'Creating...' : 'Create Ride'}
              </button>
            </form>
          </div>
        )}

        {/* My Rides */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">My Rides</h2>
          {loading ? (
            <p>Loading your rides...</p>
          ) : data?.driverRides.length === 0 ? (
            <p className="text-gray-500">You haven't created any rides yet.</p>
          ) : (
            <div className="grid gap-4">
              {data?.driverRides.map((ride: any) => (
                <div
                  key={ride.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-semibold text-gray-900">{ride.origin}</span>
                        <span className="text-gray-400">→</span>
                        <span className="font-semibold text-gray-900">{ride.destination}</span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>📅 {new Date(ride.date).toLocaleString()}</p>
                        <p>💺 {ride.availableSeats} seats available</p>
                      </div>
                    </div>
                    <div className="ml-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
