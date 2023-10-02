import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import { createJWT } from '@abticketsale/common';

// creating global tickets function for test environment (we could also have created it in separate file)
declare global {
  function ticketsCookie(): string[]; // promise will resolve itself by cookie which is an array
}

global.ticketsCookie = () => {
  // build JWT payload { id: user.id, email }
  const userId = new mongoose.Types.ObjectId().toHexString();
  const payload = { id: userId, email: 'test@test.com' };

  // create token
  const token = createJWT(payload);

  // build session object {jwt: MY_JWT} (infered by taking cookie and decoding it at https://www.base64decode.org/)
  const session = { jwt: token };

  // turn session into json
  const sessionJSON = JSON.stringify(session);

  // take json and encode ot as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  return [`session=${base64}`]; // supertest expects an array
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
