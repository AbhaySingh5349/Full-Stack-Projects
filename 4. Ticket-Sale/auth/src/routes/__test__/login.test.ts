process.env.NODE_ENV = 'test';

import request from 'supertest'; // to fake our req to express application

import { app } from '../../app';

it('fails to login for eamil that does not exists', async () => {
  const res = await request(app)
    .post('/api/users/login')
    .send({ email: 'test@test.com', password: 'password' });

  // assertion
  expect(res.statusCode).toEqual(400);
});

it('fails to login for incorrect paswword', async () => {
  const res_register = await request(app)
    .post('/api/users/register')
    .send({ email: 'test@test.com', password: 'password' });

  const res_login = await request(app)
    .post('/api/users/login')
    .send({ email: 'test@test.com', password: '12' });

  // assertion
  expect(res_register.statusCode).toEqual(201);
  expect(res_register.body).toHaveProperty('user');

  expect(res_login.statusCode).toEqual(400);
});

it('responds with cookie on successfull login', async () => {
  const res_register = await request(app)
    .post('/api/users/register')
    .send({ email: 'test@test.com', password: 'password' });

  const res_login = await request(app)
    .post('/api/users/login')
    .send({ email: 'test@test.com', password: 'password' });

  // assertion
  expect(res_register.statusCode).toEqual(201);
  expect(res_register.body).toHaveProperty('user');

  expect(res_login.statusCode).toEqual(200);
  expect(res_login.body).toHaveProperty('user');
  expect(res_login.get('Set-Cookie')).toBeDefined();
});
