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
