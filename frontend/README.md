# Car Pooling Frontend

A modern, full-featured frontend application for the Car Pooling microservices backend built with Next.js, TypeScript, Apollo Client, and TailwindCSS.

## Features

### Authentication
- User registration with role selection (Driver/Passenger)
- Login with JWT token authentication
- Role-based access control and protected routes

### Admin Dashboard
- View all users in the system
- Approve or reject driver applications
- View all bookings in the system

### Driver Dashboard
- Create new rides with origin, destination, date/time, and available seats
- View all rides created by the driver
- Real-time updates on ride availability

### Passenger Dashboard
- Search for available rides by origin and destination
- Book rides with available seats
- View all personal bookings
- Cancel bookings

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **GraphQL Client**: Apollo Client 3
- **Styling**: TailwindCSS
- **Authentication**: JWT with localStorage

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Landing page
│   ├── globals.css             # Global styles
│   ├── auth/
│   │   ├── login/page.tsx      # Login page
│   │   └── register/page.tsx   # Registration page
│   ├── admin/
│   │   └── dashboard/page.tsx  # Admin dashboard
│   ├── driver/
│   │   └── dashboard/page.tsx  # Driver dashboard
│   ├── passenger/
│   │   └── dashboard/page.tsx  # Passenger dashboard
│   └── providers/
│       └── ApolloWrapper.tsx   # Apollo Provider wrapper
├── components/
│   ├── Navbar.tsx              # Navigation bar
│   └── DashboardLayout.tsx     # Dashboard layout wrapper
├── lib/
│   ├── apollo-client.ts        # Apollo Client configuration
│   ├── auth-context.tsx        # Authentication context
│   └── graphql/
│       ├── user.graphql.ts     # User service queries/mutations
│       ├── ride.graphql.ts     # Ride service queries/mutations
│       └── booking.graphql.ts  # Booking service queries/mutations
└── package.json
```

## Prerequisites

Before running the frontend, make sure all backend services are running:

1. **User Service** on port 3001
2. **Ride Service** on port 3002
3. **Booking Service** on port 3000

## Installation

```bash
# Install dependencies
npm install
```

## Running the Application

```bash
# Development mode (with hot reload)
npm run dev

# Production build
npm run build
npm start

# Lint the code
npm run lint
```

The application will be available at **http://localhost:3000**

## Environment Configuration

The frontend is configured to connect to the following GraphQL endpoints:

- User Service: `http://localhost:3001/graphql`
- Ride Service: `http://localhost:3002/graphql`
- Booking Service: `http://localhost:3000/graphql`

If your backend services run on different ports, update the URLs in:
- `lib/apollo-client.ts`

## GraphQL Code Generation (Optional)

To generate TypeScript types from your GraphQL schemas:

```bash
# Make sure all backend services are running
npm run codegen
```

This will generate type-safe hooks and types in the `generated/` directory.

## User Flows

### 1. Registration
- Navigate to the registration page
- Fill in email, password, full name, and university ID
- Select role (Driver or Passenger)
- Drivers will need admin approval before they can create rides
- Passengers can immediately start searching and booking rides

### 2. Login
- Enter email and password
- System automatically redirects to role-appropriate dashboard

### 3. Admin Workflow
- View all users in the system
- Approve pending driver applications
- View all bookings across the platform

### 4. Driver Workflow
- Create rides by specifying origin, destination, date/time, and seats
- View all created rides
- Monitor seat availability

### 5. Passenger Workflow
- Search for rides by origin/destination
- Book available rides
- View and manage bookings
- Cancel bookings if needed

## Key Features

### Multi-Service GraphQL Support
The frontend uses a custom Apollo Client configuration that routes requests to the correct microservice based on context:

```typescript
// Example usage
const { data } = useQuery(GET_ALL_USERS_QUERY, {
  context: { service: 'user' }, // Routes to user service
});
```

### Role-Based Access Control
The `DashboardLayout` component automatically:
- Checks authentication status
- Verifies user role
- Redirects unauthorized users
- Provides consistent layout across dashboards

### Responsive Design
- Mobile-first approach with TailwindCSS
- Fully responsive layouts
- Optimized for all screen sizes

## Troubleshooting

### "Network error" or "Failed to fetch"
- Ensure all backend services are running
- Check that GraphQL endpoints are accessible
- Verify CORS is properly configured on backend services

### Authentication Issues
- Clear localStorage: `localStorage.clear()`
- Check JWT token expiration
- Verify backend authentication endpoints are working

### Styling Issues
- Run `npm run dev` again to rebuild Tailwind classes
- Check that `tailwind.config.js` includes all content paths

## Development Tips

1. **Hot Reload**: The dev server automatically reloads on file changes
2. **TypeScript**: All components are fully typed for better DX
3. **GraphQL Queries**: Keep queries in separate files for better organization
4. **Error Handling**: All mutations include error handling with user feedback

## Future Enhancements

- Add real-time notifications using WebSockets
- Implement ride ratings and reviews
- Add payment integration
- Implement chat between drivers and passengers
- Add map integration for route visualization
- Add profile management
- Implement email verification flow

## License

MIT
