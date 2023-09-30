import express from 'express';
import 'express-async-errors';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';

import { registerRouter } from './routes/register';
import { loginRouter } from './routes/login';
import { logoutRouter } from './routes/logout';
import { currentUserRouter } from './routes/current-user';
import { errorHandler } from './middlewares/error-middleware';
import { NotFoundError } from './errors/not-found-errors';

const app = express();
app.set('trust proxy', true); // traffic is proxied through ingress-nginx, so express needs to trust this HTTPS proxy

app.use(express.json());
app.use(
  cookieSession({
    signed: false, // since JWT is already encrypted
    secure: true, // allow HTTPS connection
  })
);

app.use(registerRouter);
app.use(loginRouter);
app.use(logoutRouter);
app.use(currentUserRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

const connectMongoDB = async () => {
  try {
    // db is present at other pod and to connect with that we have to go through ClusterIP service
    await mongoose.connect(
      'mongodb://auth-mongo-clusterip-srv:27017/auth-mongo-db'
    );
    console.log('auth-mongo-db is connected');
  } catch (err) {
    console.log('error connecting mongodb: ', err);
  }
};

app.listen(3000, () => {
  console.log('listening for auth on port 3000');
  if (!process.env.JWT_KEY) throw new Error('jwt env variable not defined');
  connectMongoDB();
});
