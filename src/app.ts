require('dotenv').config();
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

import {notFound, errorHandler} from './middlewares';
import MessageResponse from './interfaces/MessageResponse';
import userRoute from './api/routes/userRoute';
import authRoute from './api/routes/authRoute';

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'Welcome to the API',
  });
});

app.use('/users', userRoute);
app.use('/auth', authRoute);

app.use(notFound);
app.use(errorHandler);

export default app;
