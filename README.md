# Assignment 2: Adding users api, continuos integration and setting up git

In this assignment, the goal is to add more api endpoints to the original api, that help in creating, retrieving, and updating users in Postgres api. We are also using github to maintain the project and create a continuous integration action.

## Features

### Users Endpoints

- Users endpoints consists of 3 operations - POST, GET, PUT
- Users have unique usernames which are defined by emailID, i.e multiple users cannot have same email id.
- The POST API at `/v1/user` creates a new user and sends appropriate responses for missing fields `400`, invalid body `400`, and if username already exits `409`, and otherwise internal server error if something else goes wrong `500`.

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
