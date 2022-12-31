import Client from '../database';

export interface Product {
  id?: number;
  name: string;
  price: number;
  category: string;
}

export class ProductStore {
  async index(): Promise<Product[]> {
    try {
      const conn = await Client.connect();
      const sqlQuery = 'SELECT * FROM products';
      const result = await conn.query(sqlQuery);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Cannot get products ${err}`);
    }
  }

  async show(id: number): Promise<Product> {
    try {
      const conn = await Client.connect();
      const sqlQuery = 'SELECT * FROM products WHERE id=$1';
      const result = await conn.query(sqlQuery, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find product ${id}. Error: ${err}`);
    }
  }

  async create(product: Product): Promise<Product> {
    const { name, price, category } = product;
    try {
      const conn = await Client.connect();
      const sqlQuery = 'INSERT INTO products(name, price, category) VALUES($1, $2, $3) RETURNING *';
      const result = await conn.query(sqlQuery, [name, price, category]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot create product ${name}. ${err}`);
    }
  }

  async update(id: number, product: Product): Promise<Product> {
    const { name, price, category } = product;
    try {
      const conn = await Client.connect();
      const sqlQuery = 'UPDATE products SET name=$1, price=$2, category=$3 WHERE id=$4 RETURNING *';
      const result = await conn.query(sqlQuery, [name, price, category, id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot update product ${name}. Error ${err}`);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const conn = await Client.connect();
      const sqlQuery = 'DELETE FROM products WHERE id=$1';
      await conn.query(sqlQuery, [id]);
      conn.release();
    } catch (err) {
      throw new Error(`Cannot delete product ${id} ${err}`);
    }
  }
}
