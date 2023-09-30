process.env.NODE_ENV = 'test';

import request from 'supertest'; // to fake our req to express application

import { app } from '../../app';

it('clears cookie after logging-out', async () => {
  const res_register = await request(app)
    .post('/api/users/register')
    .send({ email: 'test@test.com', password: 'password' });

  // while testing we need to add 'cookies' to subsequent requests manually
  const cookie = res_register.get('Set-Cookie');

  const res_logout = await request(app)
    .post('/api/users/logout')
    .set('Cookie', cookie)
    .send({});

  // assertion
  expect(res_register.statusCode).toEqual(201);
  expect(res_register.body).toHaveProperty('user');
  expect(res_register.get('Set-Cookie')).toBeDefined();

  expect(res_logout.text).toEqual('user logged out successfully');
  expect(res_logout.get('Set-Cookie')[0]).toEqual(
    'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
  );
});
