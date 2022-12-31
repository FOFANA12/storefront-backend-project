import { User, UserAuth, UserStore } from '../../models/user';

const userStore = new UserStore();

describe('Test User Model', (): void => {
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

  it('Index method is defined', () => {
    expect(userStore.index).toBeDefined();
  });

  it('Show method is defined', () => {
    expect(userStore.show).toBeDefined();
  });

  it('Create method is defined', () => {
    expect(userStore.create).toBeDefined();
  });

  it('Update method is defined', () => {
    expect(userStore.update).toBeDefined();
  });

  it('Delete method is defined', () => {
    expect(userStore.delete).toBeDefined();
  });

  it('Delete method is defined', () => {
    expect(userStore.delete).toBeDefined();
  });

  it('Authentication method is defined', () => {
    expect(userStore.authenticate).toBeDefined();
  });

  it('Index method returns list of users', async () => {
    const createdUser: User = await userStore.create(userAuth);
    const result = await userStore.index();

    expect(result.length).toEqual(1);

    await userStore.delete(createdUser.id as number);
  });

  it('Show method return the correct user', async () => {
    const createdUser: User = await userStore.create(userAuth);
    const result = await userStore.show(createdUser.id as number);

    expect(result).toEqual({
      id: createdUser.id,
      ...user
    });

    await userStore.delete(createdUser.id as number);
  });

  it('Create method can add user', async () => {
    const createdUser: User = await userStore.create(userAuth);

    expect(createdUser).toEqual({
      id: createdUser.id,
      ...user
    });

    await userStore.delete(createdUser.id as number);
  });

  it('Update method updates the user', async () => {
    const createdUser: User = await userStore.create(userAuth);
    const newUser: User = {
      firstname: 'JEAN',
      lastname: 'SAMUEL',
      username: 'samjo'
    };

    const updatedUser = await userStore.update(createdUser.id as number, newUser);

    expect(updatedUser.firstname).toEqual(newUser.firstname);
    expect(updatedUser.lastname).toEqual(newUser.lastname);
    expect(updatedUser.username).toEqual(newUser.username);

    await userStore.delete(createdUser.id as number);
  });

  it('Delete method removes the product', async () => {
    const createdUser: User = await userStore.create(userAuth);
    await userStore.delete(createdUser.id as number);
    const result = await userStore.index();
    expect(result).toEqual([]);
  });

  it('Authentication can user logged in', async () => {
    const createdUser: User = await userStore.create(userAuth);
    const loggedUser: User | null = await userStore.authenticate(createdUser.username, userAuth.password);
    expect(loggedUser).not.toBeNull();
    expect((loggedUser as User).firstname).toEqual(userAuth.firstname);
    expect((loggedUser as User).lastname).toEqual(userAuth.lastname);
    expect((loggedUser as User).username).toEqual(userAuth.username);
    await userStore.delete(createdUser.id as number);
  });

  it('Authentication does not work with incorrect or non-existent data', async () => {
    const loggedUser: User | null = await userStore.authenticate(userAuth.username, userAuth.password);
    expect(loggedUser).toBeNull();
  });
});
