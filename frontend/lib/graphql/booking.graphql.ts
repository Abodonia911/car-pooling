import { gql } from '@apollo/client';

export const BOOK_RIDE_MUTATION = gql`
  mutation BookRide($data: BookRideDto!) {
    bookRide(data: $data) {
      id
      rideId
      passengerId
      destination
      createdAt
    }
  }
`;

export const CANCEL_BOOKING_MUTATION = gql`
  mutation CancelBooking($bookingId: String!, $userId: String!) {
    cancelBooking(bookingId: $bookingId, userId: $userId)
  }
`;

export const ALL_BOOKINGS_QUERY = gql`
  query AllBookings {
    allBookings {
      id
      rideId
      passengerId
      destination
      createdAt
    }
  }
`;

export const PASSENGER_RIDES_QUERY = gql`
  query PassengerRides($userId: String!) {
    PassengerRides(userId: $userId) {
      id
      rideId
      passengerId
      destination
      createdAt
    }
  }
`;

export const ADMIN_VIEWS_BOOKINGS_QUERY = gql`
  query AdminViewsBookings($userId: String!) {
    AdminViewsBookings(userId: $userId) {
      id
      rideId
      passengerId
      destination
      createdAt
    }
  }
`;
