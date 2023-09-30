process.env.NODE_ENV = 'test';

import request from 'supertest'; // to fake our req to express application

import { app } from '../../app';

it('responds with info of currrent user', async () => {
  const cookie = await global.registerCookie();

  const res_user = await request(app)
    .get('/api/users/current-user')
    .set('Cookie', cookie)
    .send();

  // assertion
  expect(res_user.body.user.email).toEqual('test@test.com');
});

it('responds with null if user not authenticated', async () => {
  const res = await request(app).get('/api/users/current-user').send();

  // assertion
  expect(res.statusCode).toEqual(200);
  expect(res.body.user).toEqual(null);
});
