import supertest, { Response, SuperTest, Test } from 'supertest';
import jwt, { Secret } from 'jsonwebtoken';
import app from '../../server';
import { Product } from '../../models/product';
import { Order, OrderProduct } from '../../models/order';
import { UserAuth } from '../../models/user';

const request: SuperTest<Test> = supertest(app);
const SECRET = process.env.TOKEN_SECRET as Secret;

describe('Test Statistic Handler', (): void => {
  let token: string, user_id: number, orderProducts: OrderProduct[];

  const products: Product[] = [
    {
      name: 'CodeMaster JAVA',
      price: 1200,
      category: 'Book'
    },
    {
      name: 'CodeMaster Phyton',
      price: 2500,
      category: 'Book'
    },
    {
      name: 'CodeMaster Node',
      price: 1200,
      category: 'Book'
    },
    {
      name: 'CodeMaster Dart',
      price: 1200,
      category: 'Book'
    },
    {
      name: 'CodeMaster .Net',
      price: 3000,
      category: 'Book'
    }
  ];
  const order: Order = {
    user_id: 1,
    status: 'active',
    products: []
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
    order.user_id = user_id;

    orderProducts = [];

    for (const product of products) {
      const responseProductRequest: Response = await request
        .post('/products')
        .set('Authorization', 'bearer ' + token)
        .send(product);
      orderProducts.push({
        product_id: responseProductRequest.body.id,
        quantity: 5
      });
    }

    order.products = orderProducts;
  });

  it('GET /orders/user/current-orders/:id : (returns current orders of user) responds with status 200', async (): Promise<void> => {
    const responseCreate: Response = await request
      .post('/orders')
      .send(order)
      .set('Authorization', 'bearer ' + token);
    expect(responseCreate.status).toBe(200);
    order.id = responseCreate.body.id;

    const responseStatistic: Response = await request
      .get(`/orders/user/current-orders/${user_id}`)
      .set('Authorization', 'bearer ' + token);
    expect(responseStatistic.status).toBe(200);
    expect(responseStatistic.body.length).toEqual(1);

    await request.delete(`/orders/${order.id}`).set('Authorization', 'bearer ' + token);
  });

  it('GET /orders/user/complete-orders/:id : (returns complete orders of user) responds with status 200', async (): Promise<void> => {
    order.status = 'complete';
    const responseCreate: Response = await request
      .post('/orders')
      .send(order)
      .set('Authorization', 'bearer ' + token);
    expect(responseCreate.status).toBe(200);
    order.id = responseCreate.body.id;

    const responseStatistic: Response = await request
      .get(`/orders/user/complete-orders/${user_id}`)
      .set('Authorization', 'bearer ' + token);
    expect(responseStatistic.status).toBe(200);
    expect(responseStatistic.body.length).toEqual(1);

    await request.delete(`/orders/${order.id}`).set('Authorization', 'bearer ' + token);
  });

  it('GET /products/frequently-ordered/:limit : (returns complete orders of user) responds with status 200', async (): Promise<void> => {
    const limit: number = 3;
    const responseCreate: Response = await request
      .post('/orders')
      .send(order)
      .set('Authorization', 'bearer ' + token);
    expect(responseCreate.status).toBe(200);
    order.id = responseCreate.body.id;

    const responseStatistic: Response = await request
      .get(`/products/frequently-ordered/${limit}`)
      .set('Authorization', 'bearer ' + token);
    expect(responseStatistic.status).toBe(200);
    expect(responseStatistic.body.length).toEqual(3);

    await request.delete(`/orders/${order.id}`).set('Authorization', 'bearer ' + token);
  });

  afterAll(async () => {
    await request.delete(`/users/${user_id}`).set('Authorization', 'bearer ' + token);
    for (const product of orderProducts) {
      await request.delete(`/products/${product.product_id}`).set('Authorization', 'bearer ' + token);
    }
  });
});
