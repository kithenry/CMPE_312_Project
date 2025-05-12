## APP README

# UniBookSwap
## Description
UniBookSwap is a platform for university students to exchange books and resources. It allows users to create listings for books they no longer need and browse available listings from other students. The goal is to promote sustainability and reduce waste by facilitating the reuse of books.

## Features
- User authentication and registration
- Create and manage book listings
- Browse and search for available books
- Chat functionality for users to communicate
- Rating and review system for books and users

## Technologies Used
- Frontend: JS, CSS, HTML
- Backend: Python, Django
- Database: MySQL

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/unibookswap.git
   ```
2. Navigate to the project directory:
   ```bash
    cd unibookswap
    ```
3. Install the required dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4. Set up the database:
    ```bash
    python manage.py migrate
    ```
5. Create a superuser:
    ```bash
    python manage.py createsuperuser
    ```
6. Run the development server:
    ```bash
    python manage.py runserver
    ```


# UniBookSwap API Documentation

## Overview
The UniBookSwap API provides endpoints for user authentication, user management, book listing, and transaction-based chat functionality. It is built with Django REST Framework and uses JWT authentication via `dj-rest-auth`. This API powers the UniBookSwap web app, enabling students to buy, sell, and exchange textbooks.

- **Base URL**: `http://localhost:8000` (update to production URL as needed)
- **Authentication**: Most endpoints require a JWT `access` token in the `Authorization: Bearer <access_token>` header, obtained via login or registration.
- **Content Type**: All requests use `Content-Type: application/json`.

## Authentication
Use the following endpoints to authenticate users and obtain JWT tokens.

### Login
Authenticates a user and returns JWT tokens.

- **Method**: `POST`
- **URL**: `/api/auth/login/`
- **Request Body**:
  ```json
  {
      "email": "string",
      "password": "string"
  }
  ```
- **Response** (200 OK):
  ```json
  {
      "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
      "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
      "user": {
          "pk": 1,
          "email": "test1@university.edu",
          "first_name": "",
          "last_name": ""
      }
  }
  ```
- **Errors**:
  - 400 Bad Request: Invalid credentials (`{"non_field_errors": ["Unable to log in with provided credentials."]}`)
- **Example**:
  ```bash
  curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "test1@university.edu", "password": "password123"}'
  ```
- **Permissions**: None (public).

### Registration
Creates a new user and returns JWT tokens.

- **Method**: `POST`
- **URL**: `/api/auth/registration/`
- **Request Body**:
  ```json
  {
      "email": "string",
      "password1": "string",
      "password2": "string"
  }
  ```
- **Response** (201 Created):
  ```json
  {
      "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
      "refresh": "...",
      "user": {
          "pk": 2,
          "email": "test3@university.edu",
          "first_name": "",
          "last_name": ""
      }
  }
  ```
- **Errors**:
  - 400 Bad Request: Email exists, passwords don’t match (`{"email": ["A user with that email already exists."]}`)
- **Example**:
  ```bash
  curl -X POST http://localhost:8000/api/auth/registration/ \
  -H "Content-Type: application/json" \
  -d '{"email": "test3@university.edu", "password1": "password789", "password2": "password789"}'
  ```
- **Permissions**: None (public).

## User Management
Manage user accounts (delete, modify details).

### Delete User
Deletes a user account.

- **Method**: `DELETE`
- **URL**: `/api/user/<id>/`
- **Request Body**: None
- **Response** (204 No Content): Empty
- **Errors**:
  - 401 Unauthorized: Missing/invalid token
  - 403 Forbidden: User lacks permission
  - 404 Not Found: User ID doesn’t exist
- **Example**:
  ```bash
  curl -X DELETE http://localhost:8000/api/user/2/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>"
  ```
- **Permissions**: Authenticated (currently allows any authenticated user; restrict to self in production).

### Modify User Details
Updates user details (e.g., username).

- **Method**: `PATCH`
- **URL**: `/api/user/<id>/`
- **Request Body**:
  ```json
  {
      "username": "string"
  }
  ```
- **Response** (200 OK):
  ```json
  {
      "id": 1,
      "email": "test1@university.edu",
      "username": "updated_test1",
      "trust_score": 0,
      "transaction_count": 0
  }
  ```
- **Errors**:
  - 400 Bad Request: Invalid data (`{"username": ["This field may not be blank."]}`)
  - 401 Unauthorized: Missing/invalid token
  - 403 Forbidden: User lacks permission
  - 404 Not Found: User ID doesn’t exist
- **Example**:
  ```bash
  curl -X PATCH http://localhost:8000/api/user/1/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{"username": "updated_test1"}'
  ```
- **Permissions**: Authenticated (currently allows any authenticated user; restrict to self in production).

## Book Management
Add books to the platform.

### Add Book
Creates a new book listing with email notification.

- **Method**: `POST`
- **URL**: `/api/books/`
- **Request Body**:
  ```json
  {
      "title": "string",
      "isbn": "string",
      "user": integer,
      "course": "string",
      "price": number,
      "exchange_option": boolean,
      "status": "string"
  }
  ```
- **Response** (201 Created):
  ```json
  {
      "id": 1,
      "title": "Python 101",
      "isbn": "1234567890123",
      "user": 1,
      "course": "CS101",
      "price": "29.99",
      "exchange_option": false,
      "status": "available"
  }
  ```
- **Errors**:
  - 400 Bad Request: Invalid data (`{"isbn": ["This field must be a valid ISBN."]}`)
  - 401 Unauthorized: Missing/invalid token
- **Example**:
  ```bash
  curl -X POST http://localhost:8000/api/books/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
      "title": "Python 101",
      "isbn": "1234567890123",
      "user": 1,
      "course": "CS101",
      "price": 29.99,
      "exchange_option": false,
      "status": "available"
  }'
  ```
- **Permissions**: Authenticated.

## Chat Feature
Send and retrieve messages for a transaction.

### Send Message
Sends a message in a transaction’s chat.

- **Method**: `POST`
- **URL**: `/api/chat/`
- **Request Body**:
  ```json
  {
      "transaction_id": integer,
      "content": "string"
  }
  ```
- **Response** (201 Created):
  ```json
  {
      "id": 1,
      "transaction_id": 1,
      "sender": {
          "id": 1,
          "email": "test1@university.edu",
          "username": "test1"
      },
      "content": "Interested in your book!",
      "timestamp": "2025-05-12T12:00:00Z"
  }
  ```
- **Errors**:
  - 400 Bad Request: Missing fields (`{"content": ["This field is required."]}`)
  - 401 Unauthorized: Missing/invalid token
  - 403 Forbidden: User not part of transaction
  - 404 Not Found: Transaction ID doesn’t exist
- **Example**:
  ```bash
  curl -X POST http://localhost:8000/api/chat/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{"transaction_id": 1, "content": "Interested in your book!"}'
  ```
- **Permissions**: Authenticated, restricted to transaction’s buyer or seller.

### List Messages
Retrieves messages for a transaction.

- **Method**: `GET`
- **URL**: `/api/chat/?transaction_id=<id>`
- **Request Body**: None
- **Response** (200 OK):
  ```json
  [
      {
          "id": 1,
          "transaction_id": 1,
          "sender": {
              "id": 1,
              "email": "test1@university.edu",
              "username": "test1"
          },
          "content": "Interested in your book!",
          "timestamp": "2025-05-12T12:00:00Z"
      }
  ]
  ```
- **Errors**:
  - 401 Unauthorized: Missing/invalid token
  - 403 Forbidden: User not part of transaction
  - 404 Not Found: Transaction ID doesn’t exist
- **Example**:
  ```bash
  curl http://localhost:8000/api/chat/?transaction_id=1 \
  -H "Authorization: Bearer <access_token>"
  ```
- **Permissions**: Authenticated, restricted to transaction’s buyer or seller.

## Notes
- **JWT Tokens**: Store the `access` token from login/registration responses and include it in the `Authorization` header for authenticated requests.
- **Error Handling**: Check response codes and error messages for debugging. Common issues include invalid tokens, missing fields, or permission errors.
- **Testing**: Use the provided `test_unibookswap.sh` script to verify backend functionality before front-end integration.
- **Test Users**:
  - Email: `test1@university.edu`, Password: `password123`
  - Email: `test2@university.edu`, Password: `password456`
- **Production**:
  - Update `http://localhost:8000` to the production URL.
  - Restrict `DELETE` and `PATCH` on `/api/user/` to the user’s own account.
  - Configure SMTP for email notifications (see `settings.py`).

For issues, contact the me via my email or check the GitHub repository for updates.
