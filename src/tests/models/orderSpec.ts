import { Order, OrderStore } from '../../models/order';
import { Product, ProductStore } from '../../models/product';
import { User, UserAuth, UserStore } from '../../models/user';

const orderStore = new OrderStore();
const userStore = new UserStore();
const productStore = new ProductStore();

describe('Test Order Model', (): void => {
  const userAuth: UserAuth = {
    firstname: 'FOFANA',
    lastname: 'BAKARY',
    username: 'fofbaky',
    password: '123456789'
  };

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

  let user_id: number, product_id: number;

  beforeAll(async () => {
    const createdUser: User = await userStore.create(userAuth);
    const createdProduct: Product = await productStore.create(product);
    user_id = createdUser.id as number;
    product_id = createdProduct.id as number;
    order.user_id = user_id;
    order.products[0].product_id = product_id;
  });

  it('Index method is defined', () => {
    expect(orderStore.index).toBeDefined();
  });

  it('Show method is defined', () => {
    expect(orderStore.show).toBeDefined();
  });

  it('Create method is defined', () => {
    expect(orderStore.create).toBeDefined();
  });

  it('Update method is defined', () => {
    expect(orderStore.update).toBeDefined();
  });

  it('Delete method is defined', () => {
    expect(orderStore.delete).toBeDefined();
  });

  it('Index method returns list of orders', async () => {
    const createdOrder: Order = await orderStore.create(order);
    const result = await orderStore.index();
    expect(result.length).toEqual(1);
    await orderStore.delete(createdOrder.id as number);
  });

  it('Show method return the correct order', async () => {
    const createdOrder: Order = await orderStore.create(order);
    const result = await orderStore.show(createdOrder.id as number);

    expect(result).toEqual({
      id: createdOrder.id,
      ...order
    });

    await orderStore.delete(createdOrder.id as number);
  });

  it('Create method can add order', async () => {
    const createdOrder: Order = await orderStore.create(order);

    expect(createdOrder).toEqual({
      id: createdOrder.id,
      ...order
    });

    await orderStore.delete(createdOrder.id as number);
  });

  it('Update method updates the order', async () => {
    const createdOrder: Order = await orderStore.create(order);
    const newOrder: Order = order;
    newOrder.status = 'complete';
    newOrder.products[0].quantity = 15;

    const updatedOrder = await orderStore.update(createdOrder.id as number, newOrder);

    expect(newOrder.status).toEqual(updatedOrder.status);
    expect(updatedOrder.products).toEqual(updatedOrder.products);

    await orderStore.delete(createdOrder.id as number);
  });

  it('Delete method removes the order', async () => {
    const createdOrder: Order = await orderStore.create(order);
    await orderStore.delete(createdOrder.id as number);
    const result = await orderStore.index();
    expect(result).toEqual([]);
  });

  afterAll(async () => {
    await userStore.delete(user_id);
    await productStore.delete(product_id);
  });
});
