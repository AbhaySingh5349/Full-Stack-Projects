process.env.NODE_ENV = 'test';

import request from 'supertest'; // to fake our req to express application
import mongoose from 'mongoose';

import { app } from '../../app';

it('returns 404 if ticket not found', async () => {
  // if ticket-id we enter here is not of MongoDB object id type, we will get a generic error (not CustomError)
  const ticketId = new mongoose.Types.ObjectId().toHexString();
  const res = await request(app).get(`/api/tickets/${ticketId}`).send();

  // assertion
  expect(res.statusCode).toEqual(404);
});

it('returns ticket if found', async () => {
  const cookie = global.ticketsCookie();

  const title = 'test';
  const price = 1;

  const res_create_ticket = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title, price, userId: '651a585b6d5e3ec170aafd6c' });

  // assertion
  expect(res_create_ticket.statusCode).toEqual(201);

  const res_get_ticket = await request(app)
    .get(`/api/tickets/${res_create_ticket.body.id}`)
    .send();

  // assertion
  expect(res_get_ticket.statusCode).toEqual(200);
  expect(res_get_ticket.body.title).toEqual(title);
  expect(res_get_ticket.body.price).toEqual(price);
});
