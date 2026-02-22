# Smart Campus System API Documentation

This document describes the authentication endpoints available in the SCAMS API.

## Base URL

All API endpoints are prefixed with `/api/v1/auth`.

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <token>
```

## Error Responses

Error responses follow this format:

```json
{
  "status": "error",
  "message": "Error message description"
}
```

## Endpoints

### POST /register

Register a new user in the system.

**Authentication Required**: No

**Request Body**:

```json
{
  "email": "student@hcmut.edu.vn",
  "password": "SecureP@ss123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "STUDENT" // Optional, defaults to "USER"
}
```

**Notes**:
- Email must end with `@hcmut.edu.vn`
- Password must be at least 8 characters and contain uppercase, lowercase, number, and special character

**Success Response (201 Created)**:

```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid-string",
      "email": "student@hcmut.edu.vn",
      "firstName": "John",
      "lastName": "Doe",
      "role": "STUDENT",
      "createdAt": "2023-10-10T10:00:00.000Z",
      "updatedAt": "2023-10-10T10:00:00.000Z"
    },
    "token": "jwt-token-string"
  }
}
```

**Error Responses**:

- **400 Bad Request**: Invalid input data
  ```json
  {
    "status": "error",
    "message": "Email must end with @hcmut.edu.vn"
  }
  ```

- **409 Conflict**: Email already registered
  ```json
  {
    "status": "error",
    "message": "Email is already registered"
  }
  ```

### POST /login

Authenticate a user and receive an access token.

**Authentication Required**: No

**Request Body**:

```json
{
  "email": "student@hcmut.edu.vn",
  "password": "SecureP@ss123"
}
```

**Success Response (200 OK)**:

```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid-string",
      "email": "student@hcmut.edu.vn",
      "firstName": "John",
      "lastName": "Doe",
      "role": "STUDENT",
      "createdAt": "2023-10-10T10:00:00.000Z",
      "updatedAt": "2023-10-10T10:00:00.000Z"
    },
    "token": "jwt-token-string"
  }
}
```

**Error Responses**:

- **401 Unauthorized**: Invalid credentials
  ```json
  {
    "status": "error",
    "message": "Invalid credentials"
  }
  ```

### POST /logout

Log out the current user.

**Authentication Required**: Yes

**Request Body**: None

**Success Response (200 OK)**:

```json
{
  "status": "success",
  "message": "Logged out successfully"
}
```

**Error Responses**:

- **401 Unauthorized**: Not authenticated
  ```json
  {
    "status": "error",
    "message": "You are not logged in. Please log in to get access."
  }
  ```

### POST /changepass

Change the current user's password.

**Authentication Required**: Yes

**Request Body**:

```json
{
  "old_password": "CurrentP@ss123",
  "new_password": "NewSecureP@ss456"
}
```

**Notes**:
- New password must be at least 8 characters and contain uppercase, lowercase, number, and special character

**Success Response (200 OK)**:

```json
{
  "status": "success",
  "message": "Password changed successfully"
}
```

**Error Responses**:

- **401 Unauthorized**: Incorrect current password
  ```json
  {
    "status": "error",
    "message": "Current password is incorrect"
  }
  ```

- **400 Bad Request**: Invalid new password
  ```json
  {
    "status": "error",
    "message": "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
  }
  ```

## Additional Notes

- All dates are returned in ISO 8601 format (YYYY-MM-DDTHH:MM:SS.sssZ)
- JWT tokens expire after 24 hours by default
- All requests and responses use JSON format
