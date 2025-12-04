'use client';

import { useQuery, useMutation } from '@apollo/client';
import { SEARCH_RIDES_QUERY } from '@/lib/graphql/ride.graphql';
import { BOOK_RIDE_MUTATION, PASSENGER_RIDES_QUERY, CANCEL_BOOKING_MUTATION } from '@/lib/graphql/booking.graphql';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/lib/auth-context';
import { useState } from 'react';

export default function PassengerDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'search' | 'mybookings'>('search');
  const [searchFilters, setSearchFilters] = useState({
    origin: '',
    destination: '',
  });

  const { data: ridesData, loading: ridesLoading, refetch: refetchRides } = useQuery(SEARCH_RIDES_QUERY, {
    context: { service: 'ride' },
    variables: {
      userId: user?.id,
      origin: searchFilters.origin || null,
      destination: searchFilters.destination || null,
    },
    skip: !user?.id,
  });

  const { data: bookingsData, loading: bookingsLoading, refetch: refetchBookings } = useQuery(PASSENGER_RIDES_QUERY, {
    context: { service: 'booking' },
    variables: { userId: user?.id },
    skip: !user?.id,
  });

  const [bookRide, { loading: booking }] = useMutation(BOOK_RIDE_MUTATION, {
    context: { service: 'booking' },
    onCompleted: () => {
      refetchRides();
      refetchBookings();
      alert('Ride booked successfully!');
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    },
  });

  const [cancelBooking] = useMutation(CANCEL_BOOKING_MUTATION, {
    context: { service: 'booking' },
    onCompleted: () => {
      refetchBookings();
      refetchRides();
      alert('Booking cancelled successfully!');
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    },
  });

  const handleSearch = () => {
    refetchRides();
  };

  const handleBookRide = (ride: any) => {
    bookRide({
      variables: {
        data: {
          rideId: ride.id,
          passengerId: user?.id,
          destination: ride.destination,
        },
      },
    });
  };

  const handleCancelBooking = (bookingId: string) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      cancelBooking({
        variables: {
          bookingId,
          userId: user?.id,
        },
      });
    }
  };

  return (
    <DashboardLayout requiredRole="PASSENGER">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Passenger Dashboard</h1>
          <p className="text-gray-600 mt-2">Search and book rides</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('search')}
              className={`${
                activeTab === 'search'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Search Rides
            </button>
            <button
              onClick={() => setActiveTab('mybookings')}
              className={`${
                activeTab === 'mybookings'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              My Bookings
            </button>
          </nav>
        </div>

        {/* Search Tab */}
        {activeTab === 'search' && (
          <>
            {/* Search Filters */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Search Rides</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="origin" className="label">
                    Origin
                  </label>
                  <input
                    type="text"
                    id="origin"
                    className="input-field"
                    placeholder="Starting location"
                    value={searchFilters.origin}
                    onChange={(e) => setSearchFilters({ ...searchFilters, origin: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="destination" className="label">
                    Destination
                  </label>
                  <input
                    type="text"
                    id="destination"
                    className="input-field"
                    placeholder="Where do you want to go?"
                    value={searchFilters.destination}
                    onChange={(e) => setSearchFilters({ ...searchFilters, destination: e.target.value })}
                  />
                </div>
                <div className="flex items-end">
                  <button onClick={handleSearch} className="btn-primary w-full">
                    Search
                  </button>
                </div>
              </div>
            </div>

            {/* Available Rides */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Available Rides</h2>
              {ridesLoading ? (
                <p>Loading rides...</p>
              ) : ridesData?.searchRides.length === 0 ? (
                <p className="text-gray-500">No rides found. Try adjusting your search criteria.</p>
              ) : (
                <div className="grid gap-4">
                  {ridesData?.searchRides.map((ride: any) => (
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
                          <button
                            onClick={() => handleBookRide(ride)}
                            disabled={booking || ride.availableSeats === 0}
                            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {ride.availableSeats === 0 ? 'Full' : 'Book'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* My Bookings Tab */}
        {activeTab === 'mybookings' && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">My Bookings</h2>
            {bookingsLoading ? (
              <p>Loading your bookings...</p>
            ) : bookingsData?.PassengerRides.length === 0 ? (
              <p className="text-gray-500">You haven't booked any rides yet.</p>
            ) : (
              <div className="grid gap-4">
                {bookingsData?.PassengerRides.map((booking: any) => (
                  <div
                    key={booking.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="text-sm text-gray-600 space-y-1">
                          <p className="font-semibold text-gray-900">Booking ID: {booking.id}</p>
                          <p>🚗 Ride ID: {booking.rideId}</p>
                          <p>📍 Destination: {booking.destination}</p>
                          <p>📅 Booked on: {new Date(booking.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="ml-4">
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="btn-danger"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
