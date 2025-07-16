# Auth Module API Documentation

This module handles authentication.

## Endpoints

### Login

- **POST /auth/login**
- Body: `{ username: string, password: string }`
- Returns: `{ access_token: string }` on success
- Errors: 401 Unauthorized if credentials are invalid

#### Example Request

```json
POST /auth/login
{
  "username": "admin",
  "password": "admin123"
}
```

#### Example Response

```json
{
  "access_token": "<JWT token>"
}
```
