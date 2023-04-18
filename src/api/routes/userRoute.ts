import express from 'express';

import {authenticate} from '../../middlewares';
import {
  checkToken,
  userDelete,
  userDeleteAsAdmin,
  userGet,
  userPut,
  userPutAsAdmin,
  userlistGet,
} from '../controller/userController';

const router = express.Router();

router
  .route('/')
  .get(userlistGet)
  .put(authenticate, userPut)
  .delete(authenticate, userDelete);

router.get('/token', authenticate, checkToken);

router
  .route('/:id')
  .get(userGet)
  .put(authenticate, userPutAsAdmin)
  .delete(authenticate, userDeleteAsAdmin);

export default router;
