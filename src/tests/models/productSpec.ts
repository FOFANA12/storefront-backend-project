import { Product, ProductStore } from '../../models/product';

const productStore = new ProductStore();

describe('Test Product Model', (): void => {
  const product: Product = {
    name: 'CodeMaster 3000',
    price: 2000,
    category: 'Book'
  };

  it('Index method is defined', () => {
    expect(productStore.index).toBeDefined();
  });

  it('Show method is defined', () => {
    expect(productStore.show).toBeDefined();
  });

  it('Create method is defined', () => {
    expect(productStore.create).toBeDefined();
  });

  it('Update method is defined', () => {
    expect(productStore.update).toBeDefined();
  });

  it('Delete method is defined', () => {
    expect(productStore.delete).toBeDefined();
  });

  it('Index method returns list of products', async () => {
    const createdProduct: Product = await productStore.create(product);
    const result = await productStore.index();

    expect(result.length).toEqual(1);

    await productStore.delete(createdProduct.id as number);
  });

  it('Show method return the correct product', async () => {
    const createdProduct: Product = await productStore.create(product);
    const result = await productStore.show(createdProduct.id as number);

    expect(result).toEqual({
      id: createdProduct.id,
      ...product
    });

    await productStore.delete(createdProduct.id as number);
  });

  it('Create method can add product', async () => {
    const createdProduct: Product = await productStore.create(product);

    expect(createdProduct).toEqual({
      id: createdProduct.id,
      ...product
    });

    await productStore.delete(createdProduct.id as number);
  });

  it('Update method updates the product', async () => {
    const createdProduct: Product = await productStore.create(product);
    const newProduct: Product = {
      name: 'CodeMaster 9999',
      price: 9999,
      category: 'Book'
    };

    const updatedProduct = await productStore.update(createdProduct.id as number, newProduct);

    expect(updatedProduct.name).toEqual(newProduct.name);
    expect(updatedProduct.price).toEqual(newProduct.price);

    await productStore.delete(createdProduct.id as number);
  });

  it('Delete method removes the product', async () => {
    const createdProduct: Product = await productStore.create(product);
    await productStore.delete(createdProduct.id as number);
    const result = await productStore.index();
    expect(result).toEqual([]);
  });
});
