import { User, UserAuth, UserStore } from '../../models/user';
import { StatisticQueries } from '../../services/statistic';
import { Order, OrderProduct, OrderStore } from '../../models/order';
import { Product, ProductStore } from '../../models/product';

const statisticQueries = new StatisticQueries();
const userStore = new UserStore();
const productStore = new ProductStore();
const orderStore = new OrderStore();

describe('Test Statistic Service', (): void => {
  let orderProducts: OrderProduct[];

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

  const userAuth: UserAuth = {
    firstname: 'FOFANA',
    lastname: 'BAKARY',
    username: 'fofbaky',
    password: '123456789'
  };

  it('currentOrders method is defined', () => {
    expect(statisticQueries.currentOrders).toBeDefined();
  });

  it('completeOrders method is defined', () => {
    expect(statisticQueries.completeOrders).toBeDefined();
  });

  it('findLastOrders method is defined', () => {
    expect(statisticQueries.findLastOrders).toBeDefined();
  });

  it('frequentlyOrderedProducts method is defined', () => {
    expect(statisticQueries.frequentlyOrderedProducts).toBeDefined();
  });

  it('currentOrders method returns current (active) orders of user', async () => {
    const createdUser: User = await userStore.create(userAuth);
    order.user_id = createdUser.id as number;

    orderProducts = [];

    for (const product of products) {
      const createdProduct: Product = await productStore.create(product);
      orderProducts.push({
        product_id: createdProduct.id as number,
        quantity: 5
      });
    }

    order.products = orderProducts;
    const createdOrder: Order = await orderStore.create(order);
    const orders: Order[] = await statisticQueries.currentOrders(createdOrder.user_id);
    expect(orders.length).toEqual(1);

    await orderStore.delete(createdOrder.id as number);
    await userStore.delete(createdUser.id as number);
    for (const product of orderProducts) {
      await productStore.delete(product.product_id as number);
    }
  });

  it('completeOrders method returns complete orders of user', async () => {
    const createdUser: User = await userStore.create(userAuth);
    order.user_id = createdUser.id as number;

    orderProducts = [];

    for (const product of products) {
      const createdProduct: Product = await productStore.create(product);
      orderProducts.push({
        product_id: createdProduct.id as number,
        quantity: 5
      });
    }

    order.status = 'complete';
    order.products = orderProducts;
    const createdOrder: Order = await orderStore.create(order);
    const orders: Order[] = await statisticQueries.completeOrders(createdOrder.user_id);
    expect(orders.length).toEqual(1);

    await orderStore.delete(createdOrder.id as number);
    await userStore.delete(createdUser.id as number);
    for (const product of orderProducts) {
      await productStore.delete(product.product_id as number);
    }
  });

  it('findLastOrders method returns n last orders of user', async () => {
    const createdUser: User = await userStore.create(userAuth);
    order.user_id = createdUser.id as number;

    orderProducts = [];

    for (const product of products) {
      const createdProduct: Product = await productStore.create(product);
      orderProducts.push({
        product_id: createdProduct.id as number,
        quantity: 5
      });
    }

    order.status = 'active';
    order.products = orderProducts;
    const createdOrder: Order = await orderStore.create(order);
    const orders: Order[] = await statisticQueries.findLastOrders(createdOrder.user_id, 5);
    expect(orders.length).toEqual(1);
    expect(orders[0].products.length).toEqual(5);

    await orderStore.delete(createdOrder.id as number);
    await userStore.delete(createdUser.id as number);
    for (const product of orderProducts) {
      await productStore.delete(product.product_id as number);
    }
  });

  it('frequentlyOrderedProducts method returns n frequently ordered products', async () => {
    const createdUser: User = await userStore.create(userAuth);
    order.user_id = createdUser.id as number;

    orderProducts = [];

    for (const product of products) {
      const createdProduct: Product = await productStore.create(product);
      orderProducts.push({
        product_id: createdProduct.id as number,
        quantity: 5
      });
    }

    order.products = orderProducts;
    const createdOrder: Order = await orderStore.create(order);
    const result = await statisticQueries.frequentlyOrderedProducts(5);
    expect(result.length).toEqual(5);

    await orderStore.delete(createdOrder.id as number);
    await userStore.delete(createdUser.id as number);
    for (const product of orderProducts) {
      await productStore.delete(product.product_id as number);
    }
  });
});
