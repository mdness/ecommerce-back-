import Server from 'services/server';
import supertest, { SuperAgentTest } from 'supertest';
import MongoMemoryServer from 'mongodb-memory-server-core';
import mongoose from 'mongoose';
import { IntItem } from 'common/interfaces/products';
import { addProductsMockDb } from '../utils/addProductsMockDB';
import { addUserAndLogin } from '../utils/addUserAndLogin';

describe("API Product's tests", () => {
  let request: SuperAgentTest;

  beforeAll(async () => {
    request = supertest.agent(Server);
    await addProductsMockDb();
    await addUserAndLogin(request);
  });

  afterAll(async () => {
    const instance: MongoMemoryServer = global.__MONGOINSTANCE__;
    Server.close();
    await instance.stop();
    await mongoose.disconnect();
  });

  it('GET: should return a list of products, 200 status code', async () => {
    const response = await request.get('/api/products');
    const productsArray = response.body.data;

    expect(productsArray.length).not.toBe(0);
    expect(response.status).toBe(200);
  });

  it('GET: should return a product by its id, 200 status code', async () => {
    const response = await request.get('/api/products');
    const expectedProductId = response.body.data[0].id;

    const productResponse = await request.get(
      `/api/products/${expectedProductId}`,
    );
    const productId = productResponse.body.data.id;

    expect(productResponse.statusCode).toBe(200);
    expect(expectedProductId).toEqual(productId);
  });

  it('POST: should add a product and return it, 200 status code', async () => {
    const mockProduct = {
      name: 'Test product',
      description:
        'Lorem ipsum dolor sit amet, nam fierent perfecto ea, pro in albucius oportere accommodare.',
      code: 'PFCH-1234-1234',
      price: 123.8,
      photo: 'https://picsum.photos/300?random=2',
      stock: 44,
    };
    const response = await request.post('/api/products').send(mockProduct);

    const products = (await request.get('/api/products')).body.data;

    const productAddedToDb = products.find(
      (item: IntItem) => item.name === 'Test product',
    );

    expect(response.statusCode).toBe(201);
    expect(response.body.data.name).toEqual('Test product');
    expect(productAddedToDb.name).toEqual('Test product');
  });

  it('PUT: should edit a product and return it, 200 status code', async () => {
    const productsResponse = await request.get('/api/products');
    const productToEdit = productsResponse.body.data[0];

    const newProductData = {
      ...productToEdit,
      name: 'Put Test',
    };

    const putResponse = await request
      .put(`/api/products/${productToEdit.id}`)
      .send(newProductData);
    const editedProduct = putResponse.body.data;

    const productEditedInDb = (
      await request.get(`/api/products/${productToEdit.id}`)
    ).body.data;

    expect(putResponse.statusCode).toBe(200);
    expect(editedProduct.name).toEqual('Put Test');
    expect(productEditedInDb.name).toEqual('Put Test');
  });

  it('DELETE: should delete a product by its id, 200 status code', async () => {
    const productsResponse = await request.get('/api/products');
    const productToDelete = productsResponse.body.data[0];

    const deleteResponse = await request.delete(
      `/api/products/${productToDelete.id}`,
    );

    const productsAfterDelete = (await request.get('/api/products')).body.data;
    const productDeleted = productsAfterDelete.find(
      (item: IntItem) => item.id === productToDelete.id,
    );

    expect(productsResponse.statusCode).toBe(200);
    expect(deleteResponse.body.data).toBe('Product deleted');
    expect(productDeleted).toBeUndefined();
  });
});
