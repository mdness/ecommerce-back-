import supertest, { SuperAgentTest } from 'supertest';
import MongoMemoryServer from 'mongodb-memory-server-core';
import mongoose from 'mongoose';
import Server from 'services/server';
import { addUserAndLogin } from '../utils/addUserAndLogin';
import { mockProduct1, mockProduct2, mockProduct3 } from './productsMock';

describe('Products api errors tests', () => {
  let request: SuperAgentTest;

  beforeAll(async () => {
    request = supertest.agent(Server);
    await addUserAndLogin(request);
  });

  afterAll(async () => {
    const instance: MongoMemoryServer = global.__MONGOINSTANCE__;
    Server.close();
    await instance.stop();
    await mongoose.disconnect();
  });

  it('GET: should return a proper error message if there are no products, 404 status code', async () => {
    const response = await request.get('/api/products');

    expect(response.status).toBe(404);
    expect(response.body.message).toEqual('No products');
  });

  it('GET: should return a proper error message if a product searched by id does not exists, 404 status code', async () => {
    const response = await request.get(
      `/api/products/619bfea7e2bf96923aa7041a`,
    );

    expect(response.status).toBe(404);
    expect(response.body.message).toEqual('Product not found');
  });

  it('POST: should return a proper error message if incorrect values are passed, 400 status code', async () => {
    await request.post('/api/products').send(mockProduct1);
    const response2 = await request.post('/api/products').send(mockProduct2);
    const response3 = await request.post('/api/products').send(mockProduct3);

    expect(response2.status).toBe(400);
    expect(response2.body.name).toEqual('ProductValidation');
    expect(response3.status).toBe(400);
    expect(response3.body.name).toEqual('MissingFieldsProduct');
  });

  it('PUT: should return a proper error message if incorrect values are passed, 400 status code', async () => {
    const response = await request.get('/api/products');
    const productToEdit = response.body.data[0];

    const editedProduct = {
      ...productToEdit,
      description:
        'Lorem ipsum dolor sit amet, nam fierent perfecto ea, pro in albucius oportere accommodare. Ius everti consectetuer et, meis mutat. Lorem ipsum dolor sit amet, nam fierent perfecto ea, pro in albucius oportere accommodare. Lorem ipsum dolor sit amet, nam fierent perfecto ea, pro in albucius oportere accommodare. Lorem ipsum dolor sit amet, nam fierent perfecto ea, pro in albucius oportere accommodare. Lorem ipsum dolor sit amet, nam fierent perfecto ea, pro in albucius oportere accommodare. Lorem ipsum dolor sit amet, nam fierent perfecto ea, pro in albucius oportere accommodare.',
    };

    const putResponse = await request
      .put(`/api/products/${productToEdit.id}`)
      .send(editedProduct);

    expect(putResponse.status).toBe(400);
    expect(putResponse.body.name).toEqual('ProductValidation');
  });

  it('PUT: should return a proper error message if the product to edit does not exis', async () => {
    const editedProduct = {
      ...mockProduct1,
      name: 'Put Edit',
    };

    const putResponse = await request
      .put('/api/products/mockMongoId')
      .send(editedProduct);

    expect(putResponse.status).toBe(404);
    expect(putResponse.body.name).toEqual('NotFound');
    expect(putResponse.body.message).toEqual(
      'Product to update does not exist.',
    );
  });

  it('DELETE: should return a proper error message if the product to delete does not exis', async () => {
    const deleteResponse = await request.delete('/api/products/mockMongoId');

    expect(deleteResponse.status).toBe(404);
    expect(deleteResponse.body.name).toEqual('NotFound');
    expect(deleteResponse.body.message).toEqual(
      'Product to delete does not exist.',
    );
  });
});
