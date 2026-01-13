# TradeEthiopia Authentication System

## Overview
The TradeEthiopia platform implements a robust authentication system with role-based access control and Google OAuth integration.

## Features

### 1. Traditional Authentication
- User registration with email and password
- Secure login with JWT tokens
- Password hashing using bcrypt

### 2. Google OAuth Integration
- Sign in with Google functionality
- Automatic user creation for new Google users
- Profile picture synchronization

### 3. Token Management
- JWT access tokens (30-day expiration)
- Refresh tokens (7-day expiration)
- Automatic token refresh on expiration
- Secure token storage in localStorage

### 4. Role-Based Access Control (RBAC)
- Four user roles: Buyer, Seller, ServiceProvider, Admin
- Role-based route protection
- Flexible middleware for access control

## Implementation Details

### Frontend
- Redux Toolkit for state management
- Automatic token inclusion in API requests
- Token refresh interceptor
- Google OAuth SDK integration

### Backend
- JWT-based authentication
- Refresh token rotation
- Google token verification
- Role-based middleware

## User Roles

### Buyer
- Browse and purchase products
- Access to cart functionality
- Basic user features

### Seller
- Create and manage products
- Access to seller dashboard
- Product management features

### ServiceProvider
- Manage service listings
- Access to service management tools

### Admin
- Full platform access
- User management
- Product verification
- Content moderation

## Google OAuth Setup

### Client-Side
1. Google SDK loaded dynamically
2. Google login initiated with client ID from environment
3. Credentials sent to backend for verification

### Server-Side
1. Google token verified with Google's tokeninfo endpoint
2. User lookup/creation based on email
3. JWT tokens generated for authenticated session

## Security Features

### Token Security
- Separate access and refresh tokens
- Secure token storage
- Automatic cleanup on logout
- Token refresh on expiration

### Password Security
- Bcrypt hashing
- Salt generation
- Secure password comparison

### Session Management
- Automatic logout on token expiration
- Secure token rotation
- Session cleanup on logout

## API Endpoints

### Authentication Routes
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/google` - Google authentication
- `POST /api/auth/refresh-token` - Token refresh
- `GET /api/auth/me` - Get current user

## Environment Variables

### Server
- `JWT_SECRET` - Secret for JWT signing
- `JWT_REFRESH_SECRET` - Secret for refresh tokens
- `MONGO_URI` - MongoDB connection string
- `CLOUDINARY_*` - Cloudinary configuration

### Client
- `VITE_API_URL` - Backend API URL
- `VITE_GOOGLE_CLIENT_ID` - Google OAuth client ID

## Error Handling

### Common Errors
- Invalid credentials
- Expired tokens
- Insufficient permissions
- Network errors

### Token Refresh
- Automatic refresh on 401 responses
- Redirect to login if refresh fails
- Retry original request after refresh

## Testing

### Unit Tests
- Authentication flows
- Token validation
- Role-based access
- Error scenarios

### Integration Tests
- Full authentication cycle
- Token refresh functionality
- Google OAuth flow

## Best Practices

### Security
- Never store passwords in plain text
- Use HTTPS in production
- Validate all inputs
- Sanitize user data

### Performance
- Efficient token validation
- Caching where appropriate
- Minimize database queries
- Optimize API responses

### User Experience
- Clear error messages
- Loading states
- Intuitive login flow
- Remember me functionality

## Future Enhancements

### Planned Features
- Multi-factor authentication
- Social login (Facebook, Twitter)
- Biometric authentication
- Single sign-on (SSO)

### Security Improvements
- Rate limiting
- CAPTCHA integration
- IP whitelisting
- Activity monitoring