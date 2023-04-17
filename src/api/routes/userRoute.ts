import express from 'express';

import {authenticate} from '../../middlewares';
import userlistGet from '../controller/userController';

const router = express.Router();

router.route('/').get(userlistGet);

router.get('/token', authenticate);

router.route('/check').get();

router.route('/:id');

export default router;
