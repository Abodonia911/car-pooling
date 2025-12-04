import { gql } from '@apollo/client';

export const CREATE_RIDE_MUTATION = gql`
  mutation CreateRide($data: CreateRideDto!) {
    createRide(data: $data) {
      id
      driverId
      origin
      destination
      date
      availableSeats
      createdAt
    }
  }
`;

export const SEARCH_RIDES_QUERY = gql`
  query SearchRides($userId: String!, $origin: String, $destination: String) {
    searchRides(userId: $userId, origin: $origin, destination: $destination) {
      id
      driverId
      origin
      destination
      date
      availableSeats
      createdAt
    }
  }
`;

export const DRIVER_RIDES_QUERY = gql`
  query DriverRides($userId: String!) {
    driverRides(userId: $userId) {
      id
      driverId
      origin
      destination
      date
      availableSeats
      createdAt
    }
  }
`;

export const ADMIN_VIEWS_RIDES_QUERY = gql`
  query AdminViewsRides($userId: String!) {
    AdminViewsBookings(userId: $userId) {
      id
      driverId
      origin
      destination
      date
      availableSeats
      createdAt
    }
  }
`;
