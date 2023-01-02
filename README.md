# Storefront Backend Project

This API is part of my training on UDACITY, and allows students to understand the development of APIs with ExpressJS.

The objective of this project is to learn API development with a database and testing under the NodeJS environment.

The implemented features are:

#### Product :

- Get a list of products;
- Create a product;
- Update a product;
- View a product;
- Delete a product.

#### User :

- Get a list of users;
- Create a user;
- Update a user;
- View a user;
- Delete a user;
- User login.

#### Order :

- Get a list of orders;
- Create a order;
- Update a order;
- View a order;
- Delete a order.

See the requirements file to learn more about endpoints and table structure [here](REQUIREMENTS.md)

## Getting started

To work with this project, you need to know JavaScript, TypeScript, ExpressJS and NodeJS.

### Configuration

#### Install depencies

This project was made with NodeJs v16.17.0 and npm 8.15.0

To install the dependencies, place yourself in the project folder and run the following command

```bash
npm install
```

#### Database

In this project, Postgres was used you must configure it in the following way.

To learn how to connect to your database, follow this link: - [https://www.w3resource.com/PostgreSQL/connect-to-postgresql-database.php](https://www.w3resource.com/PostgreSQL/connect-to-postgresql-database.php)

Connect to your database and run the following command to create a user

```bash
CREATE USER full_stack_user WITH PASSWORD 'password123';
```

full_stack_user: this is the username; Its password is: password123 you can change them

Now create the databases with the following commands

```bash
CREATE DATABASE storefront;
CREATE DATABASE storefront_test;
```

This commands will create two databases: `storefront` and `storefront_test`

Give the necessary user privileges on databases

```bash
GRANT ALL PRIVILEGES ON DATABASE storefront TO full_stack_user;
GRANT ALL PRIVILEGES ON DATABASE storefront_test TO full_stack_user;
```

#### Environment

Create a `.env` file at the root of the project and update the values. replace ### with correct values

```bash
POSTGRES_HOST = '127.0.0.1'
POSTGRES_DB = 'storefront'
POSTGRES_TEST_DB = 'storefront_test'
POSTGRES_USER = 'full_stack_user'
POSTGRES_PASSWORD = 'password123'
POSTGRES_PORT=5432
ENV="dev"
BCRYPT_PASSWORD=storefront
SALT_ROUNDS=10
TOKEN_SECRET=my-signature
```

#### Script details

- `watch` to start local server for development
- `build` to build project
- `lint` to display ESLint issues
- `lint:fix` to automatically fix ESLint issues
- `test` to run project tests

To run the local server, execute:

```bash
npm run start
```

Default URL should be http://127.0.0.1:3000/

### Testing

Create a 'database.json' file at the root of the project and update the values marked with ###

```bash
{
  "dev": {
    "driver": "pg",
    "host": "127.0.0.1",
    "database": "storefront",
    "user": "full_stack_user",
    "password": "password123"
  },
  "test": {
    "driver": "pg",
    "host": "127.0.0.1",
    "database": "storefront_test",
    "user": "full_stack_user",
    "password": "password123"
  }
}
```

To run tests : `npm run test`

### Production

To build for production, execute:

```bash
npm run build
```

The outpout folder is `dist`

## API Reference

### Getting Started

- Base URL: http://127.0.0.1:3000/

#### Endpoints

#### Products

- Index `/products` [GET]
- Create `/products` [POST] [JWT authentication is required]
- Show `/products/:id` [GET]
- Update `/products/:id` [PUT] [JWT authentication is required]
- Delete `/products/:id` [DELETE] [JWT authentication is required]

- Frenquently ordered products `/products/frequently-ordered/:limit` [GET]

#### Users

- Index `/users` [GET] [JWT authentication is required]
- Create `/users` [POST]
- Show `/users/:id` [GET] [JWT authentication is required]
- Update `/users/:id` [PUT] [JWT authentication is required]
- Delete `/users/:id` [DELETE] [JWT authentication is required]
- Auth `/users/auth` [POST]

#### Orders

- Index `/orders` [GET]
- Create `/orders` [POST] [JWT authentication is required]
- Show `/orders/:id` [GET] [JWT authentication is required]
- Update `/orders/:id` [PUT] [JWT authentication is required]
- Delete `/orders/:id` [DELETE] [JWT authentication is required]

- Current orders of user `/orders/user/current-orders/:id` [GET] [JWT authentication is required]
- Completed orders of user `/orders/user/complete-orders/:id` [GET] [JWT authentication is required]

See the requirements file to learn more about endpoints and table structure [here](REQUIREMENTS.md)

## Authors

- [Bakary FOFANA](https://github.com/FOFANA12)

## Acknowledgements

- [Udacity](https://www.udacity.com/)
