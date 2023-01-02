# API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

## API Endpoints

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

## Data Shapes

#### Product

Table: **products**

- id `SERIAL PRIMARY KEY NOT NULL`
- name `VARCHAR(250)`
- price `INTEGER `
- category `VARCHAR(250)`

#### User

Table: **users**

- id `SERIAL PRIMARY KEY NOT NULL`
- firstName `VARCHAR(250)`
- lastName `VARCHAR(250)`
- password `VARCHAR(250)`

#### Orders

Table: **users**

- id `SERIAL PRIMARY KEY NOT NULL`
- user_id `INTEGER` `REFERENCES users(id)`
- status `VARCHAR(50)`

Table: **order_products**

- order_id `INTEGER` `REFERENCES orders(id)`
- product_id `INTEGER` `REFERENCES products(id)`
- quantity `INTEGER`
