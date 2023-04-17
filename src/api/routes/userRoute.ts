import express from 'express';

import {authenticate} from '../../middlewares';

const router = express.Router();

router.route('/');

router.get('/token', authenticate);

router.route('/check').get();

router.route('/:id');

export default router;
