# EduQuest Backend API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
This API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Common Response Format
All API responses follow this structure:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "error": "Error message (if any)"
}
```

## Error Codes
- `400` - Bad Request (Invalid input)
- `401` - Unauthorized (Missing or invalid token)
- `403` - Forbidden (Access denied)
- `404` - Not Found
- `409` - Conflict (Resource already exists)
- `500` - Internal Server Error

---

## 📋 General Endpoints

### Health Check
```http
GET /health
```
**Description:** Check API health status

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-06-29T10:30:00.000Z",
  "uptime": 3600,
  "environment": "development"
}
```

### API Info
```http
GET /api/
```
**Description:** Get API information and available endpoints

**Response:**
```json
{
  "message": "EduQuest API",
  "version": "1.0.0",
  "endpoints": {
    "health": "/health",
    "auth": "/api/auth",
    "users": "/api/users"
  }
}
```

---

## 🔐 Authentication Endpoints (`/api/auth`)

### 1. Google OAuth Login
```http
GET /api/auth/google
```
**Description:** Initiate Google OAuth authentication
**Redirects to:** Google OAuth consent screen

### 2. Google OAuth Callback
```http
GET /api/auth/google/callback
```
**Description:** Handle Google OAuth callback (automatic redirect)
**Redirects to:** Frontend with token and user data

### 3. Register with Email/Password
```http
POST /api/auth/register
```
**Description:** Register a new user with email and password

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clr123abc",
    "email": "user@example.com",
    "name": "John Doe",
    "picture": null,
    "isVerified": false
  }
}
```

### 4. Login with Email/Password
```http
POST /api/auth/login
```
**Description:** Login with email and password

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clr123abc",
    "email": "user@example.com",
    "name": "John Doe",
    "picture": null,
    "isVerified": true
  }
}
```

### 5. Get Current User
```http
GET /api/auth/me
```
**Description:** Get current authenticated user details
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "user": {
    "userId": "clr123abc",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### 6. Logout
```http
POST /api/auth/logout
```
**Description:** Logout current session
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### 7. Logout from All Devices
```http
POST /api/auth/logout-all
```
**Description:** Logout from all devices/sessions
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Logged out from all devices successfully"
}
```

### 8. Debug Environment (Development Only)
```http
GET /api/auth/debug
```
**Description:** Check environment configuration (for debugging)

**Response:**
```json
{
  "port": "3000",
  "clientId": "Set",
  "clientSecret": "Set",
  "clientSecretLength": 72,
  "callbackURL": "/api/auth/google/callback",
  "fullCallbackURL": "http://localhost:3000/api/auth/google/callback",
  "frontendURL": "http://localhost:3000"
}
```

---

## 👤 User Management Endpoints (`/api/user`)

### 1. Get User Profile
```http
GET /api/user/profile
```
**Description:** Get current user's profile
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "user": {
    "email": "user@example.com",
    "name": "John Doe",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "picture": "https://example.com/avatar.jpg",
    "isActive": true,
    "isVerified": true,
    "createdAt": "2025-06-20T10:30:00.000Z",
    "updatedAt": "2025-06-29T10:30:00.000Z",
    "lastLogin": "2025-06-29T10:30:00.000Z"
  }
}
```

### 2. Update User Profile
```http
PUT /api/user/profile
```
**Description:** Update user profile information
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "John Smith",
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "clr123abc",
    "email": "user@example.com",
    "name": "John Smith",
    "firstName": "John",
    "lastName": "Smith",
    "phone": "+1234567890",
    "picture": null,
    "isActive": true,
    "isVerified": true,
    "updatedAt": "2025-06-29T10:30:00.000Z"
  }
}
```

### 3. Update Email Address
```http
PUT /api/user/profile/email
```
**Description:** Update user's email address
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "newEmail": "newemail@example.com",
  "password": "currentpassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email updated successfully. Please verify your new email.",
  "user": {
    "id": "clr123abc",
    "email": "newemail@example.com",
    "name": "John Doe",
    "isVerified": false,
    "updatedAt": "2025-06-29T10:30:00.000Z"
  }
}
```

### 4. Change Password
```http
PUT /api/user/profile/password
```
**Description:** Change user's password
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

### 5. Get User by ID
```http
GET /api/user/:id
```
**Description:** Get user details by ID (users can only access their own data)
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "clr123abc",
    "email": "user@example.com",
    "name": "John Doe",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "picture": null,
    "isActive": true,
    "isVerified": true,
    "createdAt": "2025-06-20T10:30:00.000Z",
    "updatedAt": "2025-06-29T10:30:00.000Z",
    "lastLogin": "2025-06-29T10:30:00.000Z"
  }
}
```

### 6. Delete Account
```http
DELETE /api/user/profile
```
**Description:** Delete user account permanently
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "password": "userpassword123",
  "confirmText": "DELETE MY ACCOUNT"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

---

## 🔒 Security Features

1. **JWT Authentication**: All protected endpoints require a valid JWT token
2. **Session Management**: Database-stored sessions with expiration tracking
3. **Password Hashing**: Bcrypt with salt rounds for secure password storage
4. **OAuth Integration**: Google OAuth for social login
5. **Session Cleanup**: Automatic cleanup of expired sessions
6. **Input Validation**: Request validation for all endpoints

### Authentication Flow Details

#### Session Validation Process
The authentication middleware performs the following checks:

1. **Token Presence**: Verifies that the Authorization header contains a Bearer token
2. **JWT Verification**: Validates the JWT signature and expiration
3. **Session Lookup**: Checks if the session exists in the database
4. **Session Expiration**: Validates that the session hasn't expired
5. **User Status**: Ensures the user account is still active
6. **Automatic Cleanup**: Removes expired sessions from the database

#### Error Responses
- `401 Unauthorized`: Missing or malformed token
- `403 Forbidden`: Invalid token, expired session, or inactive user account

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- PostgreSQL database
- Google OAuth credentials (for OAuth login)

### Environment Variables
Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/eduquest

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
SESSION_SECRET=your-session-secret

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Frontend Configuration
FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000
```

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd eduquest/be
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma migrate dev
   
   # (Optional) Seed the database
   npx prisma db seed
   ```

5. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

### Database Schema

The API uses the following main models:

#### User Model
```prisma
model User {
  id          String    @id @default(cuid())
  email       String    @unique
  name        String?
  firstName   String?
  lastName    String?
  phone       String?
  picture     String?
  password    String?
  isActive    Boolean   @default(true)
  isVerified  Boolean   @default(false)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  lastLogin   DateTime?
  sessions    Session[]
}
```

#### Session Model
```prisma
model Session {
  id        String   @id @default(cuid())
  token     String   @unique
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  expiresAt DateTime
  createdAt DateTime @default(now())
}
```

---

## 🧪 Testing the API

### Using cURL

#### Authentication Examples
```bash
# Register a new user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "securepassword123",
    "name": "Test User"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "securepassword123"
  }'

# Get current user (replace TOKEN with actual JWT)
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

#### User Management Examples
```bash
# Get user profile
curl -X GET http://localhost:3000/api/user/profile \
  -H "Authorization: Bearer TOKEN"

# Update profile
curl -X PUT http://localhost:3000/api/user/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "name": "Updated Name",
    "firstName": "Updated",
    "lastName": "Name",
    "phone": "+1234567890"
  }'

# Change password
curl -X PUT http://localhost:3000/api/user/profile/password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "currentPassword": "oldpassword",
    "newPassword": "newpassword123"
  }'
```

### Using Postman

1. **Import Collection**: Create a new Postman collection with the endpoints listed above
2. **Environment Variables**: Set up environment variables for `base_url` and `token`
3. **Authentication**: Set up a collection-level authorization with Bearer Token
4. **Pre-request Scripts**: Add scripts to automatically set tokens from login responses

### Testing Checklist

- [ ] User registration with valid data
- [ ] User registration with invalid/duplicate email
- [ ] Login with correct credentials
- [ ] Login with incorrect credentials
- [ ] Accessing protected routes with valid token
- [ ] Accessing protected routes with invalid/expired token
- [ ] Profile updates with valid data
- [ ] Password changes with correct current password
- [ ] Session expiration handling
- [ ] Google OAuth flow (if configured)

---

## 📝 Integration Notes for Development Teams

### Frontend Integration

#### Token Management
```javascript
// Store token securely (localStorage for demo, httpOnly cookies for production)
localStorage.setItem('authToken', response.token);

// Add token to API requests
const token = localStorage.getItem('authToken');
fetch('/api/user/profile', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

#### Error Handling
```javascript
// Handle authentication errors
fetch('/api/user/profile', { /* ... */ })
  .then(response => {
    if (response.status === 401 || response.status === 403) {
      // Redirect to login
      window.location.href = '/login';
    }
    return response.json();
  })
  .catch(error => {
    console.error('API Error:', error);
  });
```

### Backend Integration

#### Adding New Protected Routes
```typescript
import { authenticateToken } from '../middleware/authenticateJWT';

// Apply authentication middleware
router.get('/protected-route', authenticateToken, (req, res) => {
  // Access user data from req.user
  const userId = req.user.userId;
  // ... route logic
});
```

#### Custom Middleware
```typescript
// Role-based access control example
export const requireRole = (role: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.user.role !== role) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};
```

### Mobile App Integration

#### React Native Example
```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Store token
await AsyncStorage.setItem('authToken', token);

// API call with token
const token = await AsyncStorage.getItem('authToken');
const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### Rate Limiting Recommendations

For production deployment, consider implementing rate limiting:

```typescript
import rateLimit from 'express-rate-limit';

// Authentication rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts, please try again later'
});

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. JWT Token Issues
- **Problem**: "Invalid or expired token"
- **Solution**: Check token format, expiration, and JWT_SECRET configuration

#### 2. Database Connection
- **Problem**: "Can't reach database server"
- **Solution**: Verify DATABASE_URL and database server status

#### 3. Google OAuth Issues
- **Problem**: OAuth callback failures
- **Solution**: Check GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and callback URL configuration

#### 4. CORS Issues
- **Problem**: "Access blocked by CORS policy"
- **Solution**: Verify CORS_ORIGIN matches frontend URL

### Debug Endpoints

Use the debug endpoint for troubleshooting:
```bash
curl http://localhost:3000/api/auth/debug
```

### Logging

The API includes structured logging. Check console output for:
- Request details
- Database queries
- Authentication attempts
- Error stack traces

---

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/)
- [JWT.io](https://jwt.io/) - JWT debugger
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)

---

## 🤝 Support

For questions or issues:
1. Check the troubleshooting section above
2. Review the codebase in the `be/src` directory
3. Contact the backend development team
4. Create an issue in the project repository

---

**Last Updated:** June 29, 2025  
**API Version:** 1.0.0  
**Documentation Version:** 1.0.0
