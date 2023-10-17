# LawAdvisor Todo API

This repository contains the code for a technical exam as part of a job application at LawAdvisor Ventures. The goal of this project is to create an API for managing a TODO list with specific functionalities.

## Features

- **Register**: Users can register with a unique username and password.
- **Login**: Registered users can log in to obtain an access token for other endpoints.
- **TODO List**: Users can manage their own TODO list, including:
  - Listing all tasks
  - Adding a task
  - Updating task details
  - Removing a task
  - Reordering tasks
    - A task can be moved more than 50 times.
    - A task can be moved to more than one task away from its current position.
- Proper error handling with corresponding HTTP status codes.

## Installation

### Prerequisites

- Node.js
- PostgreSQL
- TypeScript

### Steps

1. **Clone the Repository**:

   ```bash
   git clone [repository-url]
   cd lawadvisor-todo-api
   ```

First, you need to clone the repository to your local machine. You can use the following command:

bash
Copy code
git clone [repository-url]
cd lawadvisor-todo-api
Install Dependencies

Once you're in the project directory, install the necessary packages using npm:

bash
Copy code
npm install
Setup the Database

Ensure PostgreSQL is installed and running.
Create a database for the application.
Update the database connection details in the appropriate configuration file.
Run Prisma Migrations

Before you start the server, you need to run Prisma migrations to ensure your database schema is up-to-date:

bash
Copy code
npx prisma migrate dev --preview-feature
Start the Server

There are two ways to start the server:

In development mode with nodemon:

bash
Copy code
npm run dev
Or, in production mode:

bash
Copy code
npm start
Once the server starts, you should see logs indicating that the server is running and that it has connected to the PostgreSQL/Prisma database.

Testing the API

With the server running, you can use tools like Postman or Insomnia to test the API endpoints. The API routes are prefixed with /v1.

## Folder structure

│
├── app - Core application files.
│
├── config - Configuration files, including logger and authentication settings.
│
├── constants - Constant values used throughout the application, like messages.
│
├── controllers - Route handlers that manage incoming requests and send responses.
│
├── database - Database-related files, including the client setup.
│
├── helpers - Utility functions and classes to assist with specific tasks (e.g., password hashing, JWT management).
│
├── middleware - Functions executed before hitting the main controllers, like authentication or validation.
│
├── node_modules - Node.js module dependencies for the project.
│
├── prisma - Prisma ORM related files including migrations and schema definitions.
│
├── routes - Definitions of API routes and endpoints.
│
├── services - Business logic for processing data and interfacing with the database.
│
└── utils - Additional utility files and helper functions.

## Tech Stack

Core
Node.js: The runtime environment used to execute the server-side JavaScript code.

Express: A minimal and flexible web application framework for Node.js, providing a robust set of features for web and mobile applications.

Security
bcrypt: A library to help with hashing passwords for secure storage.

helmet: Helps secure Express applications with various HTTP headers.

express-jwt: Middleware for validating JWTs for authentication.

passport: Express-compatible authentication middleware for Node.js.

passport-jwt: A Passport strategy for authenticating with a JSON Web Token.

Database
@prisma/client: The Prisma client library providing access to the database.

pg: Non-blocking PostgreSQL client for Node.js. Useful for connecting to PostgreSQL databases.

prisma: The Prisma CLI for database migrations and other database-related tasks.

Data Validation
joi: Object schema description language and validator for JavaScript objects.
Development
nodemon: A utility that monitors for any changes in your source and automatically restarts the server.

typescript: A typed superset of JavaScript that compiles to plain JavaScript.

ts-node: Executes TypeScript directly, used for running the app in development.

Utilities
compression: Middleware that will attempt to compress response bodies for all request that traverse through the middleware.

cors: Middleware for enabling Cross-Origin Resource Sharing in the Express app.

http-status: Utility to interact with HTTP status codes.

jsonwebtoken: An implementation of JSON Web Tokens.

winston: A multi-transport async logging library for Node.js.

xss-filters: A library to sanitize user data to prevent XSS attacks.

## Functionality

Ordering API

Lexical RankString for TODOs
Use this system to generate rank strings for ordering TODOs, especially in drag-and-drop contexts.

Why Use This?
Efficient Ordering: With this approach, when you move a TODO, you don't have to update the order of all other TODOs.
Scalable: Can handle a large number of TODOs without frequent recalculations.
How It Works
Base Case: If it's the first TODO, the rank string is '0|aaaa:'.
Increment: For existing TODOs, it checks the last rank string and increases its value lexicographically.
Handling 'z': If a rank ends with 'z', it rolls over, like how 9 becomes 10 in numbering.
Drag-and-Drop
Top: Generate a rank before the first TODO.
Between: Generate a rank after the previous TODO.
Bottom: Generate a rank after the last TODO.
Note: Continuous insertions between two points may exhaust available ranks. Consider recalculating ranks if this happens frequently.
