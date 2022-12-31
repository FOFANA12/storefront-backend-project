import dotenv from 'dotenv';
import { PoolConfig, Pool } from 'pg';

dotenv.config();

const { POSTGRES_HOST, POSTGRES_DB, POSTGRES_PORT, POSTGRES_TEST_DB, POSTGRES_USER, POSTGRES_PASSWORD, ENV } =
  process.env;

const config: PoolConfig = {
  host: POSTGRES_HOST,
  port: POSTGRES_PORT as unknown as number,
  database: POSTGRES_DB,
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD
};

if (ENV === 'test') {
  config.database = POSTGRES_TEST_DB;
}

export default new Pool(config);
