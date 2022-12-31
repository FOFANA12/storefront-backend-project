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

## Getting started

To work with this project, you need to know JavaScript, TypeScript, ExpressJS and NodeJS.

### Configuration

#### Install depencies

This project was made with NodeJs v16.17.0 and npm 8.15.0

To install the dependencies, place yourself in the project folder and run the following command

```bash
npm install
```

#### Environment

Create a `.env` file at the root of the project and update the values. replace ### with correct values

```bash
POSTGRES_HOST = '127.0.0.1'
POSTGRES_DB = 'storefront'
POSTGRES_TEST_DB = 'storefront_test'
POSTGRES_USER = '###'
POSTGRES_PASSWORD = '###'
POSTGRES_PORT=5432
ENV="dev"
BCRYPT_PASSWORD=storefront
SALT_ROUNDS=10
TOKEN_SECRET=my-signature
```

You must create two databases. One for development and one for testing. In this case, `storefront` is used in development and `storefront_test` is for testing.

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
    "user": "###",
    "password": "###"
  },
  "test": {
    "driver": "pg",
    "host": "127.0.0.1",
    "database": "storefront_test",
    "user": "###",
    "password": "###"
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

see requirements file [here](REQUIREMENTS.md)

## Authors

- [Bakary FOFANA](https://github.com/FOFANA12)

## Acknowledgements

- [Udacity](https://www.udacity.com/)
