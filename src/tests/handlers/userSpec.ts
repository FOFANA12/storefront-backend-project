import supertest, { Response, SuperTest, Test } from 'supertest';
import jwt, { Secret } from 'jsonwebtoken';
import app from '../../server';
import { User, UserAuth } from '../../models/user';

const request: SuperTest<Test> = supertest(app);
const SECRET = process.env.TOKEN_SECRET as Secret;

describe('Test User Handler', (): void => {
  let token: string, user_id: number;
  const user: User = {
    firstname: 'FOFANA',
    lastname: 'BAKARY',
    username: 'fofbaky'
  };
  const userAuth: UserAuth = {
    firstname: 'FOFANA',
    lastname: 'BAKARY',
    username: 'fofbaky',
    password: '123456789'
  };

  it('POST /users : responds with status 200', async (): Promise<void> => {
    const response: Response = await request.post('/users').send(userAuth);

    token = response.body.token;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { user } = jwt.verify(token, SECRET);
    user_id = user.id;
    expect(response.status).toBe(200);
  });

  it('Endpoints (Index, Show, Update, Delete) require authentication', async (): Promise<void> => {
    const responseIndex: Response = await request.get('/users');
    expect(responseIndex.status).toBe(401);

    const responseShow: Response = await request.get(`/users/${user_id}`);
    expect(responseShow.status).toBe(401);

    const newUser: User = {
      firstname: 'FOFANA',
      lastname: 'BAKARY',
      username: 'fofbaky12'
    };

    const responseUpdate: Response = await request.put(`/users/${user_id}`).send(newUser);
    expect(responseUpdate.status).toBe(401);

    const responseDelete: Response = await request.delete(`/users/${user_id}`);
    expect(responseDelete.status).toBe(401);
  });

  it('GET /users : responds with status 200', async (): Promise<void> => {
    const response: Response = await request.get('/users').set('Authorization', 'bearer ' + token);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('GET /users/:id : responds with status 200', async (): Promise<void> => {
    const response: Response = await request.get(`/users/${user_id}`).set('Authorization', 'bearer ' + token);
    expect(response.status).toBe(200);
    expect(response.body.user).toEqual({
      id: user_id,
      ...user
    });
  });

  it('PUT /users/:id : responds with status 200', async (): Promise<void> => {
    const newUser: User = {
      firstname: 'FOFANA',
      lastname: 'BAKARY',
      username: 'fofbaky12'
    };

    const response: Response = await request
      .put(`/users/${user_id}`)
      .send(newUser)
      .set('Authorization', 'bearer ' + token);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: user_id,
      ...newUser
    });
  });

  it('DELETE /users : responds with status 200', async (): Promise<void> => {
    const response: Response = await request.delete(`/users/${user_id}`).set('Authorization', 'bearer ' + token);
    expect(response.status).toBe(200);
  });
});
