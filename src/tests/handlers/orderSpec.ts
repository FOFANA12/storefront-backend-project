import supertest, { Response, SuperTest, Test } from 'supertest';
import jwt, { Secret } from 'jsonwebtoken';
import app from '../../server';
import { UserAuth } from '../../models/user';
import { Product } from '../../models/product';
import { Order } from '../../models/order';

const request: SuperTest<Test> = supertest(app);
const SECRET = process.env.TOKEN_SECRET as Secret;

describe('Test Order Handler', (): void => {
  let token: string, user_id: number, product_id: number, order_id: number;

  const product: Product = {
    name: 'CodeMaster 3000',
    price: 2000,
    category: 'Book'
  };
  const order: Order = {
    user_id: 1,
    status: 'active',
    products: [
      {
        product_id: 1,
        quantity: 5
      }
    ]
  };

  const newOrder: Order = {
    user_id: 1,
    status: 'active',
    products: [
      {
        product_id: 1,
        quantity: 10
      }
    ]
  };

  beforeAll(async () => {
    const userAuth: UserAuth = {
      firstname: 'FOFANA',
      lastname: 'BAKARY',
      username: 'fofbaky',
      password: '123456789'
    };

    const responseUserRequest: Response = await request.post('/users').send(userAuth);
    token = responseUserRequest.body.token;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { user } = jwt.verify(token, SECRET);
    user_id = user.id;

    const responseProductRequest: Response = await request
      .post('/products')
      .set('Authorization', 'bearer ' + token)
      .send(product);
    product_id = responseProductRequest.body.id;

    order.products[0].product_id = product_id;
    order.user_id = user_id;

    newOrder.products[0].product_id = product_id;
    newOrder.user_id = user_id;
  });

  it('POST /orders : responds with status 200', async (): Promise<void> => {
    const response: Response = await request
      .post('/orders')
      .send(order)
      .set('Authorization', 'bearer ' + token);
    expect(response.status).toBe(200);
    order_id = response.body.id;
  });

  it('Endpoints (Create, Show, Update, Delete) require authentication', async (): Promise<void> => {
    const responseCreate: Response = await request.post('/orders').send(order);
    expect(responseCreate.status).toBe(401);

    const responseShow: Response = await request.get(`/orders/${order_id}`);
    expect(responseShow.status).toBe(401);

    const responseUpdate: Response = await request.put(`/orders/${order_id}`).send(newOrder);
    expect(responseUpdate.status).toBe(401);

    const responseDelete: Response = await request.delete(`/orders/${user_id}`);
    expect(responseDelete.status).toBe(401);
  });

  it('GET /orders : responds with status 200', async (): Promise<void> => {
    const response: Response = await request.get('/orders');
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('GET /orders/:id : responds with status 200', async (): Promise<void> => {
    const response: Response = await request.get(`/orders/${order_id}`).set('Authorization', 'bearer ' + token);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: order_id,
      ...order
    });
  });

  it('PUT /orders/:id : responds with status 200', async (): Promise<void> => {
    const response: Response = await request
      .put(`/orders/${order_id}`)
      .send(newOrder)
      .set('Authorization', 'bearer ' + token);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: order_id,
      ...newOrder
    });
  });

  it('DELETE /orders : responds with status 200', async (): Promise<void> => {
    const response: Response = await request.delete(`/orders/${order_id}`).set('Authorization', 'bearer ' + token);
    expect(response.status).toBe(200);
  });

  afterAll(async () => {
    await request.delete(`/users/${user_id}`).set('Authorization', 'bearer ' + token);
    await request.delete(`/products/${product_id}`).set('Authorization', 'bearer ' + token);
  });
});
