import Client from '../database';
import { Order } from '../models/order';
import { Product } from '../models/product';

export class StatisticQueries {
  // Returns current (active) orders of a user
  async currentOrders(id: number): Promise<Order[]> {
    try {
      const orders: Order[] = [];
      const conn = await Client.connect();
      const sqlQueryOrder = 'SELECT * FROM orders WHERE user_id=$1 AND status=$2 ORDER BY id ASC';
      const result = await conn.query(sqlQueryOrder, [id, 'active']);

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
      throw new Error(`Unable to get user orders ${err}`);
    }
  }

  // Returns complete orders of a user
  async completeOrders(id: number): Promise<Order[]> {
    try {
      const orders: Order[] = [];
      const conn = await Client.connect();
      const sqlQueryOrder = 'SELECT * FROM orders WHERE user_id=$1 AND status=$2 ORDER BY id ASC';
      const result = await conn.query(sqlQueryOrder, [id, 'complete']);

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
      throw new Error(`Unable to get user orders ${err}`);
    }
  }

  // Returns the last 5 orders of a user
  async findLastOrders(id: number, limit = 5): Promise<Order[]> {
    try {
      const orders: Order[] = [];
      const conn = await Client.connect();
      const sqlQueryOrder = 'SELECT * FROM orders WHERE user_id=$1 ORDER BY id DESC LIMIT $2';
      const result = await conn.query(sqlQueryOrder, [id, limit]);

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
      throw new Error(`Unable to get user orders ${err}`);
    }
  }

  // Returns the n frequently ordered products
  async frequentlyOrderedProducts(limit: number): Promise<Product[]> {
    try {
      const conn = await Client.connect();

      const sqlQuery =
        'SELECT name, price, category FROM products JOIN order_products ON products.id=order_products.product_id GROUP BY products.id ORDER BY COUNT(products.id) DESC LIMIT $1';

      const result = await conn.query(sqlQuery, [limit]);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Unable to get frequently ordered products ${err}`);
    }
  }
}
