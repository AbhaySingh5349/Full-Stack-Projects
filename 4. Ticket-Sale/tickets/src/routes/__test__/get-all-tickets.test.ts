process.env.NODE_ENV = 'test';

import request from 'supertest'; // to fake our req to express application
import mongoose from 'mongoose';

import { app } from '../../app';

const createTicket = () => {
  const cookie = global.ticketsCookie();

  const title = 'test';
  const price = 1;
  const userId = new mongoose.Types.ObjectId().toHexString();

  const res = request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title, price, userId });

  return res;
};

it('can fetch tickets', async () => {
  await createTicket();
  await createTicket();
  await createTicket();

  const res = await request(app).get('/api/tickets').send();

  // assertion
  expect(res.statusCode).toEqual(200);
  expect(res.body.length).toEqual(3);
});
