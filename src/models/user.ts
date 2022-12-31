import Client from '../database';
import bcrypt from 'bcrypt';

const { BCRYPT_PASSWORD, SALT_ROUNDS } = process.env;

export interface User {
  id?: number;
  firstname: string;
  lastname: string;
  username: string;
}

export interface UserAuth extends User {
  password: string;
}

export class UserStore {
  async index(): Promise<User[]> {
    try {
      const conn = await Client.connect();
      const sqlQuery = 'SELECT id, firstname, lastname, username FROM users';
      const result = await conn.query(sqlQuery);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Cannot get users ${err}`);
    }
  }

  async show(id: number): Promise<User> {
    try {
      const conn = await Client.connect();
      const sqlQuery = 'SELECT id, firstname, lastname, username FROM users WHERE id=$1';
      const result = await conn.query(sqlQuery, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find user ${id}. Error: ${err}`);
    }
  }

  async create(user: UserAuth): Promise<User> {
    const { firstname, lastname, username, password } = user;
    try {
      const conn = await Client.connect();
      const sqlQuery =
        'INSERT INTO users(firstname, lastname, username, password_digest) VALUES($1, $2, $3, $4) RETURNING id, firstname, lastname, username';
      const hash = bcrypt.hashSync(password + BCRYPT_PASSWORD, parseInt(SALT_ROUNDS as string, 10));
      const result = await conn.query(sqlQuery, [firstname, lastname, username, hash]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot create user ${firstname} ${lastname}. ${err}`);
    }
  }

  async update(id: number, user: User): Promise<User> {
    const { firstname, lastname, username } = user;
    try {
      const conn = await Client.connect();
      const sqlQuery =
        'UPDATE users SET firstname=$1, lastname=$2, username=$3 WHERE id=$4 RETURNING id, firstname, lastname, username';
      const result = await conn.query(sqlQuery, [firstname, lastname, username, id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot update user ${firstname} ${lastname}. Error ${err}`);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const conn = await Client.connect();
      const sqlQuery = 'DELETE FROM users WHERE id=$1';
      await conn.query(sqlQuery, [id]);
      conn.release();
    } catch (err) {
      throw new Error(`Cannot delete user ${id} ${err}`);
    }
  }

  async authenticate(username: string, password: string): Promise<User | null> {
    try {
      const conn = await Client.connect();
      const sqlQuery = 'SELECT id, firstname, lastname, username, password_digest FROM users WHERE username=$1';
      const result = await conn.query(sqlQuery, [username]);
      conn.release();
      if (result.rows.length) {
        const user = result.rows[0];
        if (bcrypt.compareSync(password + BCRYPT_PASSWORD, user.password_digest)) {
          delete user['password_digest'];
          return user;
        }
      }
      return null;
    } catch (err) {
      throw new Error(`Cannot not find user ${username} ${err}`);
    }
  }
}
