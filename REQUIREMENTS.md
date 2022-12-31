# API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

## API Endpoints

#### Products

- Index `/products` [GET]
- Create `/products` [POST] [token required]
- Show `/products/:id` [GET]
- Update `/products/:id` [PUT] [token required]
- Delete `/products/:id` [DELETE] [token required]

- Frenquently ordered products `/products/frequently-ordered/:limit` [GET]

#### Users

- Index `/users` [GET] [token required]
- Create `/users` [POST]
- Show `/users/:id` [GET] [token required]
- Update `/users/:id` [PUT] [token required]
- Delete `/users/:id` [DELETE] [token required]
- Auth `/users/auth` [POST]

#### Orders

- Index `/orders` [GET]
- Create `/orders` [POST] [token required]
- Show `/orders/:id` [GET] [token required]
- Update `/orders/:id` [PUT] [token required]
- Delete `/orders/:id` [DELETE] [token required]

- Current orders of user `/orders/user/current-orders/:id` [GET] [token required]
- Completed orders of user `/orders/user/complete-orders/:id` [GET] [token required]

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
