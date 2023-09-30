import express from 'express';
import 'express-async-errors';
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
    secure: process.env.NODE_ENV !== 'test', // allow HTTPS connection for prod
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

export { app };
