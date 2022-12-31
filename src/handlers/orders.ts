import { Application, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Order, OrderProduct, OrderStore } from '../models/order';
import { validateCreateRequest, validateParamId, validateUpdateRequest } from '../middlewares/orderValidators';
import { checkAuthHeader } from '../middlewares/jwt';
import { StatisticQueries } from '../services/statistic';

const orderStore = new OrderStore();
const statisticQueries = new StatisticQueries();

const index = async (_req: Request, res: Response) => {
  try {
    const orders: Order[] = await orderStore.index();
    res.json(orders);
  } catch (err: unknown) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: (err as Error).message });
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number;
    const order: Order = await orderStore.show(id);

    res.json(order);
  } catch (err: unknown) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: (err as Error).message });
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const order: Order = {
      user_id: body.user_id as unknown as number,
      products: body.products as unknown as OrderProduct[],
      status: body.status as unknown as string
    };

    /*  if (order.products === undefined || order.status === undefined || order.user_id === undefined) {
      res.status(400).json({ message: 'Some required parameters are missing! eg. :products, :status, :user_id' });
      return;
    }*/

    const newOrder: Order = await orderStore.create(order);

    res.json(newOrder);
  } catch (err: unknown) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: (err as Error).message });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number;
    const body = req.body;
    const order: Order = {
      user_id: body.user_id as unknown as number,
      products: body.products as unknown as OrderProduct[],
      status: body.status as unknown as string
    };

    if (order.products === undefined || order.status === undefined || order.user_id === undefined || id === undefined) {
      res.status(400).json({ message: 'Some required parameters are missing! eg. :products, :status, :user_id, :id' });
      return;
    }

    const newOrder: Order = await orderStore.update(id, order);

    res.json(newOrder);
  } catch (err: unknown) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: (err as Error).message });
  }
};

const deleteOrder = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number;

    if (id === undefined) {
      res.status(400).json({ message: 'Missing required parameter :id.' });
      return;
    }

    await orderStore.delete(id);

    res.json({ message: `Order with id ${id} successfully deleted.` });
  } catch (err: unknown) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: (err as Error).message });
  }
};

const currentOrders = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number;
    const orders: Order[] = await statisticQueries.currentOrders(id);
    res.json(orders);
  } catch (err: unknown) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: (err as Error).message });
  }
};

const completeOrders = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number;
    const orders: Order[] = await statisticQueries.completeOrders(id);
    res.json(orders);
  } catch (err: unknown) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: (err as Error).message });
  }
};

export default function orderRoutes(app: Application) {
  app.get('/orders', index);
  app.post('/orders', validateCreateRequest, checkAuthHeader, create);
  app.get('/orders/:id', validateParamId, checkAuthHeader, show);
  app.put('/orders/:id', validateUpdateRequest, checkAuthHeader, update);
  app.delete('/orders/:id', validateParamId, checkAuthHeader, deleteOrder);

  app.get('/orders/user/current-orders/:id', validateParamId, checkAuthHeader, currentOrders);
  app.get('/orders/user/complete-orders/:id', validateParamId, checkAuthHeader, completeOrders);
}
