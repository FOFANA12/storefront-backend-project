import { Application, Request, Response } from 'express';
import { Product, ProductStore } from '../models/product';
import { checkAuthHeader } from '../middlewares/jwt';
import { StatusCodes } from 'http-status-codes';
import { validateCreateRequest, validateParamId, validateUpdateRequest } from '../middlewares/productValidators';
import { StatisticQueries } from '../services/statistic';

const productStore = new ProductStore();
const statisticQueries = new StatisticQueries();

const index = async (_req: Request, res: Response) => {
  try {
    const products: Product[] = await productStore.index();
    res.json(products);
  } catch (err: unknown) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: (err as Error).message });
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number;
    const product: Product = await productStore.show(id);
    res.json(product);
  } catch (err: unknown) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: (err as Error).message });
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const product: Product = {
      name: body.name as unknown as string,
      price: body.price as unknown as number,
      category: body.category as unknown as string
    };
    const newProduct: Product = await productStore.create(product);
    res.json(newProduct);
  } catch (err: unknown) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: (err as Error).message });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number;
    const body = req.body;
    const product: Product = {
      name: body.name as unknown as string,
      price: body.price as unknown as number,
      category: body.category as unknown as string
    };
    const newProduct: Product = await productStore.update(id, product);
    res.json(newProduct);
  } catch (err: unknown) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: (err as Error).message });
  }
};

const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number;
    await productStore.delete(id);
    res.json({ message: `Product with id ${id} successfully deleted.` });
  } catch (err: unknown) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: (err as Error).message });
  }
};

const frequentlyOrderedProducts = async (req: Request, res: Response) => {
  try {
    let limit = req.params.limit as unknown as number;
    if (limit === undefined) limit = 5;

    const products: Product[] = await statisticQueries.frequentlyOrderedProducts(limit);
    return res.json(products);
  } catch (err: unknown) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: (err as Error).message });
  }
};

export default function productRoutes(app: Application) {
  app.get('/products', index);
  app.post('/products', validateCreateRequest, checkAuthHeader, create);
  app.get('/products/:id', validateParamId, show);
  app.put('/products/:id', validateUpdateRequest, checkAuthHeader, update);
  app.delete('/products/:id', validateParamId, checkAuthHeader, deleteProduct);

  app.get('/products/frequently-ordered/:limit', frequentlyOrderedProducts);
}
