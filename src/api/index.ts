import express from 'express';

import authRoute from './routes/authRoute';
import userRoute from './routes/userRoute';

import MessageResponse from '../interfaces/MessageResponse';

// Router
const router = express.Router();

// Root
router.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'Routes: users, auth',
  });
});

// Routes
router.use('/users', userRoute);
router.use('/auth', authRoute);

export default router;
