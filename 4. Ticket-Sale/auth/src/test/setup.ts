import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../app';

// creating global register function for test environment (we could also have created it in separate file)
declare global {
  function registerCookie(): Promise<string[]>; // promise will resolve itself by cookie which is an array
}

global.registerCookie = async () => {
  const email = 'test@test.com';
  const password = 'password';

  const res_register = await request(app)
    .post('/api/users/register')
    .send({ email, password });

  // assertion
  expect(res_register.statusCode).toEqual(201);
  expect(res_register.body).toHaveProperty('user');

  return res_register.get('Set-Cookie');
};
let mongo: any;

// hook to run before all tests are completed
beforeAll(async () => {
  process.env.JWT_KEY = 'string';

  mongo = await MongoMemoryServer.create();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

// hook to run before each test
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  // reset data between each test we run
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

// hook to run after all tests are completed
afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});
