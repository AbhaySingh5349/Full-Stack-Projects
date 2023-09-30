process.env.NODE_ENV = 'test';

import request from 'supertest'; // to fake our req to express application

import { app } from '../../app';

it('sets cookie after successful register', async () => {
  const res = await request(app)
    .post('/api/users/register')
    .send({ email: 'test@test.com', password: 'password' });

  // assertion
  expect(res.statusCode).toEqual(201);
  expect(res.body).toHaveProperty('user');
  expect(res.get('Set-Cookie')).toBeDefined();
});

it('returns 400 on invalid email', async () => {
  const res = await request(app)
    .post('/api/users/register')
    .send({ email: 'test@test.', password: 'password' });

  // assertion
  expect(res.statusCode).toEqual(400);
});

it('returns 400 on invalid password', async () => {
  const res = await request(app)
    .post('/api/users/register')
    .send({ email: 'test@test.com', password: '1' });

  // assertion
  expect(res.statusCode).toEqual(400);
});

it('returns 400 on missing email or password', async () => {
  const res_email = await request(app)
    .post('/api/users/register')
    .send({ email: 'test@test.com' });

  const res_password = await request(app)
    .post('/api/users/register')
    .send({ password: '12' });

  // assertion
  expect(res_email.statusCode).toEqual(400);
  expect(res_password.statusCode).toEqual(400);
});

it('rejects duplicate email', async () => {
  const res_register = await request(app)
    .post('/api/users/register')
    .send({ email: 'test@test.com', password: 'password' });

  const res_duplicate = await request(app)
    .post('/api/users/register')
    .send({ email: 'test@test.com', password: 'password' });

  // assertion
  expect(res_register.statusCode).toEqual(201);
  expect(res_register.body).toHaveProperty('user');

  expect(res_duplicate.statusCode).toEqual(400);
});
