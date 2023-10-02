import request from 'supertest'; // to fake our req to express application
import mongoose from 'mongoose';

import { app } from '../../app';

it('returns 404 if provided ticket-id does not exists', async () => {
  const cookie = global.ticketsCookie();

  const ticketId = new mongoose.Types.ObjectId().toHexString();
  //   const userId = new mongoose.Types.ObjectId().toHexString();
  const res = await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set('Cookie', cookie)
    .send({ title: 'new_test', price: 2 });

  // assertion
  expect(res.statusCode).toEqual(404);
});

it('returns 401 if user is not authenticated', async () => {
  const ticketId = new mongoose.Types.ObjectId().toHexString();
  const res = await request(app)
    .put(`/api/tickets/${ticketId}`)
    .send({ title: 'new_test', print: 2 });

  // assertion
  expect(res.statusCode).toEqual(401);
});

it('returns 401 if user does not own a ticket', async () => {
  const create_cookie = global.ticketsCookie();
  const res_create_ticket = await request(app)
    .post('/api/tickets')
    .set('Cookie', create_cookie)
    .send({ title: 'test', price: 1 });

  // assertion
  expect(res_create_ticket.statusCode).toEqual(201);

  const update_cookie = global.ticketsCookie();
  const res_update_ticket = await request(app)
    .put(`/api/tickets/${res_create_ticket.body.id}`)
    .set('Cookie', update_cookie)
    .send({ title: 'new_test', price: 2 });

  // assertion
  expect(res_update_ticket.statusCode).toEqual(401);
});

it('returns 400 if user provides invalid input', async () => {
  const cookie = global.ticketsCookie();

  const res_create_ticket = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'test', price: 1 });

  // assertion
  expect(res_create_ticket.statusCode).toEqual(201);

  const res_update_1_ticket = await request(app)
    .put(`/api/tickets/${res_create_ticket.body.id}`)
    .set('Cookie', cookie)
    .send({ title: '', price: 1 });

  const res_update_2_ticket = await request(app)
    .put(`/api/tickets/${res_create_ticket.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'new_test', price: -1 });

  // assertion
  expect(res_update_1_ticket.statusCode).toEqual(400);
  expect(res_update_2_ticket.statusCode).toEqual(400);
});

it('updates ticket provided valid input', async () => {
  const cookie = global.ticketsCookie();

  const res_create_ticket = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'test', price: 1 });

  // assertion
  expect(res_create_ticket.statusCode).toEqual(201);

  const res_update_ticket = await request(app)
    .put(`/api/tickets/${res_create_ticket.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'new_test', price: 2 });

  // assertion
  expect(res_update_ticket.statusCode).toEqual(200);

  const res_get_ticket = await request(app)
    .get(`/api/tickets/${res_update_ticket.body.id}`)
    .send();

  // assertion
  expect(res_get_ticket.statusCode).toEqual(200);
  expect(res_get_ticket.body.title).toEqual('new_test');
  expect(res_get_ticket.body.price).toEqual(2);
});
