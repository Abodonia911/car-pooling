import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Create HTTP links for each microservice
const userServiceLink = new HttpLink({
  uri: 'http://localhost:3001/graphql',
});

const rideServiceLink = new HttpLink({
  uri: 'http://localhost:3002/graphql',
});

const bookingServiceLink = new HttpLink({
  uri: 'http://localhost:3000/graphql',
});

// Auth link to add JWT token to requests
const authLink = setContext((_, { headers }) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Directional link to route requests to the correct service
const directionalLink = ApolloLink.split(
  (operation) => {
    const context = operation.getContext();
    return context.service === 'user';
  },
  from([authLink, userServiceLink]),
  ApolloLink.split(
    (operation) => {
      const context = operation.getContext();
      return context.service === 'ride';
    },
    from([authLink, rideServiceLink]),
    from([authLink, bookingServiceLink])
  )
);

// Create Apollo Client
export const client = new ApolloClient({
  link: directionalLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});
