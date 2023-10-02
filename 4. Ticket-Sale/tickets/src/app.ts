import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import {
  errorHandler,
  NotFoundError,
  getCurrentUser,
} from '@abticketsale/common';

import { createTicketRouter } from './routes/create-ticket';
import { getTicketByIdRouter } from './routes/get-ticket-by-id';
import { getAllTicketsRouter } from './routes/get-all-tickets';
import { updateTicketByIdRouter } from './routes/update-ticket';

const app = express();
app.set('trust proxy', true); // traffic is proxied through ingress-nginx, so express needs to trust this HTTPS proxy

app.use(express.json());
app.use(
  cookieSession({
    signed: false, // since JWT is already encrypted
    secure: process.env.NODE_ENV !== 'test', // allow HTTPS connection for prod
  })
);

app.use(getCurrentUser);

app.use(createTicketRouter);
app.use(getTicketByIdRouter);
app.use(getAllTicketsRouter);
app.use(updateTicketByIdRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
