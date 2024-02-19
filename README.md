# Assignment 2: Enhancing Users API, Continuous Integration, and Git Setup

In this assignment, the primary objective is to expand the API functionality by introducing additional endpoints that facilitate the creation, retrieval, and modification of user data in the Postgres API. Concurrently, we are leveraging GitHub for project management and implementing continuous integration actions.

## Features

### Users Endpoints

- The Users endpoints encompass three fundamental operations: POST, GET, and PUT.
- Usernames are unique and are defined by email ID, ensuring that multiple users cannot share the same email ID and return 409

#### Create User

- The POST API at /v1/user initiates the creation of a new user and provides relevant responses for different scenarios:
  - Responds with 400 for missing fields or an invalid body.
  - Responds with 409 if the username already exists.
  - Handles other potential errors with an internal server error (500).

#### Get self User

- The GET API at /v1/user/self verifies the presence of a basic authentication token through middleware.
  - If authorized, returns user data.
  - If unauthorized, sends an unauthorized message with a 400 status code.

#### Update self user

- The PUT API at /v1/user/self checks for the presence of updatable fields along with an authentication token.
  - If authorized, updates the user data accordingly.
  - If unauthorized, sends an unauthorized message with a 400 status code.

# Assignment 1: Building a Basic API with Node.js, Express, Sequelize, and PostgreSQL

In this assignment, the goal is to create a simple API to test the connection to a local database. The project utilizes Node.js, Express, Sequelize, and PostgreSQL to showcase the required functionality.

## Features

### Healthz Endpoint
- The API includes a `healthz` endpoint designed to perform a database connection test.
- To start database server use `Postgres` desktop app
- To verify the connection status, you can use the following curl request:
```bash
curl -vvvv http://localhost:3000/healthz
```
- This request returns either "OK" or "Service Unavailable" based on the connection status.
  
## Middleware Blocking Other HTTP Methods
- The healthz endpoint has been secured by middleware to allow only specific HTTP methods.
- To test this middleware, you can use the following curl requests:
  - PUT request:
  ```bash 
  curl -vvvv -X PUT http://localhost:3000/healthz
  ```

  - POST request:
  ```bash 
  curl -vvvv -X PUT http://localhost:3000/healthz
  ```
  - DELETE request:
  ```bash 
  curl -vvvv -X DELETE http://localhost:3000/healthz
  ```
  - PATCH request:
  ```bash 
  curl -vvvv -X PATCH http://localhost:3000/healthz
  ```
