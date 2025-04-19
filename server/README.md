# OnlyConcerts Server

The server-side component of the OnlyConcerts platform.

## Environment Variables

Create a `.env` file in the server directory with:

```
# Database configuration
DB_USER=your_db_username
DB_HOST=localhost
DB_NAME=onlyconcerts
DB_PASSWORD=your_db_password
DB_PORT=5432

# Authentication
JWT_SECRET=your_secret_key_here

# External APIs
USE_REAL_API=true      # Set to false for mock data
CLIENT_ID=your_seatgeek_client_id
```

## Running Locally

```bash
# Start the development server with hot reload
node app.js
```

## API Reference

### Authentication
These endpoints handle user registration, login, and token verification.

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get token |
| GET | `/api/auth/verify` | Verify token validity |

### Concerts
These endpoints handle concert data and user interactions.

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/postgres/concert-details` | No | Get all concerts with details |
| GET | `/api/postgres/artist-reviews/:artistName` | No | Get artist reviews |
| GET | `/api/postgres/user-concerts` | Yes | Get user's concerts |
| POST | `/api/postgres/complete-concert` | No | Create a new concert |
| POST | `/api/postgres/concerts/:id/rate` | Yes | Rate a concert |
| POST | `/api/postgres/concerts/:id/review` | Yes | Add/update review text |
| POST | `/api/postgres/concerts/:id/favorite` | Yes | Toggle favorite status |

### Entity Management
These endpoints manage core entities like artists and venues.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/postgres/artists` | List all artists |
| POST | `/api/postgres/artists` | Create a new artist |
| GET | `/api/postgres/venues` | List all venues |
| POST | `/api/postgres/venues` | Create a new venue |

## Concert Sync Service

The server automatically syncs concert data:
- Initial sync on startup
- Scheduled sync every 6 hours

Configure via environment variables:
- `USE_REAL_API=true`: Use SeatGeek API
- `USE_REAL_API=false`: Generate mock data

## Database Utilities

```bash
# Test database connections and queries
node queryTest.js

# Test SeatGeek API connection
node test_api.js
```

## Authentication Flow

1. User registers/logs in and receives a JWT token
2. Token is included in `Authorization: Bearer <token>` header
3. Protected routes check token via auth middleware
4. Tokens expire after 24 hours

## Logging & Error Handling

- Request logging via Morgan
- Structured error responses
- Development-specific error details when `NODE_ENV=development`

## Rate Limiting

API endpoints are protected by rate limiting:
- 100 requests per IP address
- 15 minute window
- Configurable in `app.js`