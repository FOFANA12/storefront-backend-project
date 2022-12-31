import Client from '../database';

export interface OrderProduct {
  product_id: number;
  quantity: number;
}

export interface Order {
  id?: number;
  status: string;
  user_id: number;
  products: OrderProduct[];
}

export class OrderStore {
  async index(): Promise<Order[]> {
    try {
      const orders: Order[] = [];
      const conn = await Client.connect();
      const sqlQueryOrder = 'SELECT * FROM orders';
      const result = await conn.query(sqlQueryOrder);

      const sqlQueryOrderProduct = 'SELECT product_id, quantity FROM order_products WHERE order_id=$1';

      for (const order of result.rows) {
        const { rows: orderProductRows } = await conn.query(sqlQueryOrderProduct, [order.id]);
        orders.push({
          ...order,
          products: orderProductRows
        });
      }

      conn.release();
      return orders;
    } catch (err) {
      throw new Error(`Cannot get orders ${err}`);
    }
  }

  async show(id: number): Promise<Order> {
    try {
      const conn = await Client.connect();
      const sqlQueryOrder = 'SELECT * FROM orders WHERE id=$1';
      const result = await conn.query(sqlQueryOrder, [id]);
      const order = result.rows[0];

      const sqlQueryOrderProduct = 'SELECT product_id, quantity FROM order_products WHERE order_id=$1';
      const { rows: orderProductRows } = await conn.query(sqlQueryOrderProduct, [id]);

      conn.release();
      return {
        ...order,
        products: orderProductRows
      };
    } catch (err) {
      throw new Error(`Could not find order ${id}. Error: ${err}`);
    }
  }

  async create(order: Order): Promise<Order> {
    const { status, user_id, products } = order;
    try {
      const conn = await Client.connect();
      const sqlQueryOrder = 'INSERT INTO orders(status, user_id) VALUES($1, $2) RETURNING *';
      const result = await conn.query(sqlQueryOrder, [status, user_id]);
      const order = result.rows[0];

      const sqlQueryOrderProduct =
        'INSERT INTO order_products (order_id, product_id, quantity) VALUES($1, $2, $3) RETURNING product_id, quantity';
      const orderProducts = [];
      for (const product of products) {
        const { product_id, quantity } = product;

        const { rows } = await conn.query(sqlQueryOrderProduct, [order.id, product_id, quantity]);
        orderProducts.push(rows[0]);
      }

      conn.release();
      return {
        ...order,
        products: orderProducts
      };
    } catch (err) {
      throw new Error(`Cannot create order. ${err}`);
    }
  }

  async update(id: number, order: Order): Promise<Order> {
    const { products, status } = order;
    try {
      const conn = await Client.connect();
      const sqlQueryOrder = 'UPDATE orders SET status=$1 WHERE id=$2 RETURNING *';
      const result = await conn.query(sqlQueryOrder, [status, id]);
      const order = result.rows[0];

      const sqlQueryOrderProduct =
        'UPDATE order_products SET product_id=$1, quantity=$2 WHERE order_id=$3 RETURNING product_id, quantity';
      const orderProducts = [];

      for (const product of products) {
        const { product_id, quantity } = product;
        const { rows } = await conn.query(sqlQueryOrderProduct, [product_id, quantity, order.id]);
        orderProducts.push(rows[0]);
      }

      conn.release();
      return {
        ...order,
        products: orderProducts
      };
    } catch (err) {
      throw new Error(`Cannot update order. Error ${err}`);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const conn = await Client.connect();

      const sqlQueryOrderProduct = 'DELETE FROM order_products WHERE order_id=$1';
      await conn.query(sqlQueryOrderProduct, [id]);

      const sqlQueryOrder = 'DELETE FROM orders WHERE id=$1';
      await conn.query(sqlQueryOrder, [id]);

      conn.release();
    } catch (err) {
      throw new Error(`Cannot delete order ${id} ${err}`);
    }
  }

  async addProduct(id: number, orderProduct: OrderProduct): Promise<OrderProduct> {
    const { quantity, product_id } = orderProduct;
    try {
      const conn = await Client.connect();
      const sqlQueryOrder = 'SELECT * FROM orders WHERE id=$1';
      const { rows } = await conn.query(sqlQueryOrder, [id]);
      const order: Order = rows[0];

      if (order.status.toLowerCase() === 'close') {
        throw new Error('This order is closed');
      }

      const sqlQuery =
        'INSERT INTO order_products(quantity, product_id, order_id) VALUES($1, $2, $3) RETURNING product_id, quantity';
      const result = await conn.query(sqlQuery, [quantity, product_id, id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot add product. ${err}`);
    }
  }
}
