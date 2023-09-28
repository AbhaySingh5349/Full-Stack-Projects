import express from 'express';
import 'express-async-errors';
import { registerRouter } from './routes/register';
import { loginRouter } from './routes/login';
import { logoutRouter } from './routes/logout';
import { currentUserRouter } from './routes/current-user';
import { errorHandler } from './middlewares/error-middleware';
import { NotFoundError } from './errors/not-found-errors';

const app = express();

app.use(express.json());

app.use(registerRouter);
app.use(loginRouter);
app.use(logoutRouter);
app.use(currentUserRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

app.listen(3000, () => {
  console.log('listening for auth on port 3000');
});
