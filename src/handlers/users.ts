import { Application, Request, Response } from 'express';
import { User, UserAuth, UserStore } from '../models/user';
import { Order } from '../models/order';
import { checkAuthHeader, generateToken } from '../middlewares/jwt';
import {
  validateAuthRequest,
  validateCreateRequest,
  validateParamId,
  validateUpdateRequest
} from '../middlewares/userValidators';
import { StatusCodes } from 'http-status-codes';
import { StatisticQueries } from '../services/statistic';

const userStore = new UserStore();
const statisticQueries = new StatisticQueries();

const index = async (_req: Request, res: Response) => {
  try {
    const users: User[] = await userStore.index();
    res.json(users);
  } catch (err: unknown) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: (err as Error).message });
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number;

    const user: User = await userStore.show(id);
    const orders: Order[] = await statisticQueries.findLastOrders(id);

    res.json({ user, orders });
  } catch (err: unknown) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: (err as Error).message });
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const userAuth: UserAuth = {
      firstname: body.firstname as unknown as string,
      lastname: body.lastname as unknown as string,
      username: body.username as unknown as string,
      password: body.password as unknown as string
    };

    const user: User = await userStore.create(userAuth);
    res.json({ user: user, token: generateToken(user) });
  } catch (err: unknown) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: (err as Error).message });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const id: number = req.params.id as unknown as number;

    const body = req.body;
    const user: User = {
      firstname: body.firstname as unknown as string,
      lastname: body.lastname as unknown as string,
      username: body.username as unknown as string
    };

    const newUser: User = await userStore.update(id, user);

    res.json(newUser);
  } catch (err: unknown) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: (err as Error).message });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number;

    await userStore.delete(id);

    res.json({ message: `User with id ${id} successfully deleted.` });
  } catch (err: unknown) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: (err as Error).message });
  }
};

const authenticate = async (req: Request, res: Response) => {
  try {
    const username = req.body.username as unknown as string;
    const password = req.body.password as unknown as string;

    const user: User | null = await userStore.authenticate(username, password);

    if (user === null) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: `Wrong password for user ${username}.` });
      return;
    }

    res.json({ user: user, token: generateToken(user) });
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: (err as Error).message });
  }
};

export default function userRoutes(app: Application) {
  app.get('/users', checkAuthHeader, index);
  app.post('/users', validateCreateRequest, create);
  app.get('/users/:id', validateParamId, checkAuthHeader, show);
  app.put('/users/:id', validateUpdateRequest, checkAuthHeader, update);
  app.delete('/users/:id', validateParamId, checkAuthHeader, deleteUser);
  app.post('/users/auth', validateAuthRequest, authenticate);
}
