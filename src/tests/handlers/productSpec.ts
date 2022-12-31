import supertest, { Response, SuperTest, Test } from 'supertest';
import jwt, { Secret } from 'jsonwebtoken';
import app from '../../server';
import { UserAuth } from '../../models/user';
import { Product } from '../../models/product';

const request: SuperTest<Test> = supertest(app);
const SECRET = process.env.TOKEN_SECRET as Secret;

describe('Test Product Handler', (): void => {
  let token: string, user_id: number, product_id: number;

  const product: Product = {
    name: 'CodeMaster Python',
    price: 1500,
    category: 'Book'
  };

  const newProduct: Product = {
    name: 'CodeMaster Node',
    price: 2000,
    category: 'Book'
  };

  beforeAll(async () => {
    const userAuth: UserAuth = {
      firstname: 'FOFANA',
      lastname: 'BAKARY',
      username: 'fofbaky',
      password: '123456789'
    };

    const response: Response = await request.post('/users').send(userAuth);
    token = response.body.token;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { user } = jwt.verify(token, SECRET);
    user_id = user.id;
  });

  it('POST /products : responds with status 200', async (): Promise<void> => {
    const response: Response = await request
      .post('/products')
      .send(product)
      .set('Authorization', 'bearer ' + token);
    expect(response.status).toBe(200);
    product_id = response.body.id;
  });

  it('Endpoints (Create, Update, Delete) require authentication', async (): Promise<void> => {
    const responseCreate: Response = await request.post('/products').send(product);
    expect(responseCreate.status).toBe(401);

    const responseUpdate: Response = await request.put(`/products/${product_id}`).send(newProduct);
    expect(responseUpdate.status).toBe(401);

    const responseDelete: Response = await request.delete(`/products/${product_id}`);
    expect(responseDelete.status).toBe(401);
  });

  it('GET /products : responds with status 200', async (): Promise<void> => {
    const response: Response = await request.get('/products');
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('GET /products/:id : responds with status 200', async (): Promise<void> => {
    const response: Response = await request.get(`/products/${product_id}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: product_id,
      ...product
    });
  });

  it('PUT /products/:id : responds with status 200', async (): Promise<void> => {
    const response: Response = await request
      .put(`/products/${product_id}`)
      .send(newProduct)
      .set('Authorization', 'bearer ' + token);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: product_id,
      ...newProduct
    });
  });

  it('DELETE /products : responds with status 200', async (): Promise<void> => {
    const response: Response = await request.delete(`/products/${product_id}`).set('Authorization', 'bearer ' + token);
    expect(response.status).toBe(200);
  });

  afterAll(async () => {
    await request.delete(`/users/${user_id}`).set('Authorization', 'bearer ' + token);
  });
});
