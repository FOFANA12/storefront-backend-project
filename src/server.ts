import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import productRoutes from './handlers/products';
import orderRoutes from './handlers/orders';
import userRoutes from './handlers/users';

const app: express.Application = express();
const port: number = 3000;
const address: string = `0.0.0.0:${port}`;

app.use(bodyParser.json());

app.get('/', function (_req: Request, res: Response) {
  res.send('Hello World!');
});

userRoutes(app);
productRoutes(app);
orderRoutes(app);

app.listen(port, function () {
  console.log(`starting app on: ${address}`);
});

export default app;
