import mongoose from 'mongoose';

import { app } from './app';

const connectMongoDB = async () => {
  try {
    // db is present at other pod and to connect with that we have to go through ClusterIP service

    await mongoose.connect(process.env.MONGO_URI!);
    console.log('tickets-mongo-db is connected');
  } catch (err) {
    console.log('error connecting mongodb: ', err);
  }
};

app.listen(3000, () => {
  console.log('listening for tickets on port 3000');
  if (!process.env.JWT_KEY)
    throw new Error('tickets jwt env variable not defined');
  if (!process.env.MONGO_URI)
    throw new Error('tickets mongo_uri variable not defined');
  connectMongoDB();
});
