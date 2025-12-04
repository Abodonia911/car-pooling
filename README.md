# University Car Pooling - Full Stack Application

A complete microservices-based car pooling application for universities, built with NestJS, GraphQL, Kafka, and Next.js.

## Project Overview

This is a full-stack car pooling platform that allows university students to share rides. The system supports three user roles:
- **Admin**: Manage users and approve driver applications
- **Driver**: Create and manage rides
- **Passenger**: Search, book, and manage ride bookings

## Architecture

### Backend (Microservices)
The backend consists of 4 microservices communicating via Kafka and GraphQL:

1. **User Service** (Port 3001)
   - User registration and authentication
   - JWT token generation
   - Driver approval workflow
   - User management

2. **Ride Service** (Port 3002)
   - Create rides
   - Search rides by origin/destination
   - View driver's rides
   - Manage ride availability

3. **Booking Service** (Port 3000)
   - Book rides
   - Cancel bookings
   - View passenger bookings
   - Admin booking overview

4. **Notification Service**
   - Event-driven notifications via Kafka
   - Handles booking confirmations and updates

### Frontend (Next.js)
- Modern React-based web application
- GraphQL integration with Apollo Client
- Role-based dashboards
- Responsive UI with TailwindCSS

## Tech Stack

### Backend
- **Framework**: NestJS
- **API**: GraphQL (Apollo Server)
- **Database**: PostgreSQL with Prisma ORM
- **Message Queue**: Kafka
- **Authentication**: JWT
- **Language**: TypeScript

### Frontend
- **Framework**: Next.js 15 (App Router)
- **GraphQL Client**: Apollo Client 3
- **Styling**: TailwindCSS
- **State Management**: React Context API
- **Language**: TypeScript

## Prerequisites

Before running the application, ensure you have:

- Node.js 18+ installed
- PostgreSQL database running
- Kafka broker running (for microservices communication)
- npm or yarn package manager

## Quick Start

### 1. Backend Services

#### Start Kafka
```bash
# Using Docker (recommended)
docker run -d --name kafka -p 9092:9092 apache/kafka:latest

# Or install and run Kafka locally
```

#### User Service
```bash
cd user-service
npm install
# Set up .env file with database connection
npx prisma migrate dev
npx prisma generate
npm run start:dev
```

#### Ride Service
```bash
cd ride-service
npm install
# Set up .env file with database connection
npx prisma migrate dev
npx prisma generate
npm run start:dev
```

#### Booking Service
```bash
cd booking-service
npm install
# Set up .env file with database connection
npx prisma migrate dev
npx prisma generate
npm run start:dev
```

#### Notification Service
```bash
cd notification-service
npm install
npm run start:dev
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at **http://localhost:3000**

## GraphQL Endpoints

Once all services are running, you can access GraphQL Playground at:

- User Service: http://localhost:3001/graphql
- Ride Service: http://localhost:3002/graphql
- Booking Service: http://localhost:3000/graphql

## Default Admin Account

To create an admin account, you'll need to:

1. Register a new user through the frontend
2. Manually update the user's role to `ADMIN` in the database
3. Or use the GraphQL mutation directly

```graphql
mutation {
  register(data: {
    email: "admin@university.edu"
    password: "admin123"
    fullName: "Admin User"
    role: ADMIN
    universityId: "ADMIN001"
  }) {
    id
    email
    role
  }
}
```

## Features

### Authentication & Authorization
- Secure registration and login
- JWT-based authentication
- Role-based access control
- Protected routes on frontend

### User Management
- Admin can view all users
- Admin can approve/reject driver applications
- Email verification workflow (for drivers)

### Ride Management
- Drivers can create rides with details
- Passengers can search by origin/destination
- Real-time seat availability
- Date/time-based ride scheduling

### Booking System
- Easy booking process
- Booking cancellation
- View all bookings (admin)
- View personal bookings (passengers)

### Notifications (Event-Driven)
- Booking confirmations
- Ride updates
- Driver approval notifications

## API Documentation

### User Service

#### Queries
```graphql
getUserByEmail(email: String!): User
getAllUsers: [User!]!
```

#### Mutations
```graphql
register(data: CreateUserDto!): User!
login(data: LoginInput!): LoginResponse!
approveDriver(userId: String!): String!
RejectDriver(userId: String!): String!
```

### Ride Service

#### Queries
```graphql
searchRides(userId: String!, origin: String, destination: String): [Ride!]!
driverRides(userId: String!): [Ride!]!
AdminViewsBookings(userId: String!): [Ride!]!
```

#### Mutations
```graphql
createRide(data: CreateRideDto!): Ride!
```

### Booking Service

#### Queries
```graphql
allBookings: [Booking!]!
PassengerRides(userId: String!): [Booking!]!
AdminViewsBookings(userId: String!): [Booking!]!
```

#### Mutations
```graphql
bookRide(data: BookRideDto!): Booking!
cancelBooking(bookingId: String!, userId: String!): String!
```

## Project Structure

```
car-pooling/
├── user-service/           # User management & authentication
│   ├── src/
│   ├── prisma/
│   └── package.json
├── ride-service/           # Ride creation & search
│   ├── src/
│   ├── prisma/
│   └── package.json
├── booking-service/        # Booking management
│   ├── src/
│   ├── prisma/
│   └── package.json
├── notification-service/   # Event-driven notifications
│   ├── src/
│   └── package.json
├── frontend/               # Next.js web application
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── package.json
└── README.md
```

## Development Workflow

1. **Backend Development**
   - Each service runs independently on its own port
   - Use GraphQL Playground to test queries/mutations
   - Prisma Studio for database management: `npx prisma studio`

2. **Frontend Development**
   - Hot reload enabled for fast development
   - Apollo Client DevTools for GraphQL debugging
   - TailwindCSS for rapid UI development

3. **Testing**
   - Unit tests: `npm test`
   - E2E tests: `npm run test:e2e`

## Troubleshooting

### Kafka Connection Issues
- Ensure Kafka is running on `localhost:9092`
- Check that consumer groups are properly configured
- Verify network connectivity

### Database Connection
- Check `.env` file has correct DATABASE_URL
- Run `npx prisma migrate dev` to apply migrations
- Use `npx prisma studio` to inspect data

### GraphQL Errors
- Check service logs for detailed error messages
- Verify all services are running
- Test queries in GraphQL Playground first

### Frontend Issues
- Clear localStorage if authentication fails
- Check browser console for errors
- Verify backend services are accessible

## Environment Variables

### Backend Services (.env)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
JWT_SECRET="your-secret-key"
KAFKA_BROKER="localhost:9092"
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_USER_SERVICE_URL=http://localhost:3001/graphql
NEXT_PUBLIC_RIDE_SERVICE_URL=http://localhost:3002/graphql
NEXT_PUBLIC_BOOKING_SERVICE_URL=http://localhost:3000/graphql
```

## Deployment

### Backend
- Use Docker Compose for containerization
- Deploy to Kubernetes for orchestration
- Use managed Kafka (AWS MSK, Confluent Cloud)
- Use managed PostgreSQL (RDS, Cloud SQL)

### Frontend
- Deploy to Vercel (recommended for Next.js)
- Or use Docker with Nginx
- Configure environment variables in deployment platform

## Security Considerations

- All passwords are hashed with bcrypt
- JWT tokens have expiration times
- CORS is configured for production
- Input validation on all mutations
- SQL injection protection via Prisma
- XSS protection in frontend

## Future Enhancements

- [ ] Real-time updates with WebSockets/Server-Sent Events
- [ ] Rating and review system
- [ ] Payment integration
- [ ] Chat functionality between drivers and passengers
- [ ] Push notifications
- [ ] Email notifications
- [ ] Map integration for route visualization
- [ ] Mobile app (React Native)
- [ ] Analytics dashboard
- [ ] API rate limiting
- [ ] Redis caching layer

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT

## Support

For issues and questions:
- Open an issue on GitHub
- Check existing documentation
- Review GraphQL schemas in each service

## Authors

University Car Pooling Team
