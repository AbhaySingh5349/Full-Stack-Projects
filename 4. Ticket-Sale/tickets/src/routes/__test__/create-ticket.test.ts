process.env.NODE_ENV = 'test';

import request from 'supertest'; // to fake our req to express application
import mongoose from 'mongoose';

import { app } from '../../app';
import { Ticket } from '../../models/ticket-model';

it('has a route handler listening to /api/tickets for post requests', async () => {
  const res = await request(app).post('/api/tickets').send({});

  // assertion
  expect(res.statusCode).not.toEqual(404);
});

it('rejects access if user is not logged-in', async () => {
  const res = await request(app).post('/api/tickets').send({});

  // assertion
  expect(res.statusCode).toEqual(401);
});

it('allow access if user is logged-in', async () => {
  const cookie = global.ticketsCookie();

  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({});

  // assertion
  expect(res.statusCode).not.toEqual(401);
});

it('returns error for invalid title', async () => {
  const cookie = global.ticketsCookie();

  const res_1 = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ price: 10 });

  const res_2 = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: '', price: 10 });

  // assertion
  expect(res_1.statusCode).toEqual(400);
  expect(res_2.statusCode).toEqual(400);
});

it('returns error for invalid price', async () => {
  const cookie = global.ticketsCookie();

  const res_1 = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'test' });

  const res_2 = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'test', price: -1 });

  // assertion
  expect(res_1.statusCode).toEqual(400);
  expect(res_2.statusCode).toEqual(400);
});

it('creates ticket with valid inputs', async () => {
  let tickets = await Ticket.find({});

  // assertion
  expect(tickets.length).toEqual(0); // since before each test-case, db is cleared

  const cookie = global.ticketsCookie();

  const title = 'test';
  const price = 1;
  const userId = new mongoose.Types.ObjectId().toHexString();

  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title, price, userId });

  tickets = await Ticket.find({});

  // assertion
  expect(res.statusCode).toEqual(201);
  expect(tickets.length).toEqual(1);
  expect(tickets[0].title).toEqual(title);
  expect(tickets[0].price).toEqual(price);
});
