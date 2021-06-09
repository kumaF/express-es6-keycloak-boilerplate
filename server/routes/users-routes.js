'use strict';

import { Router } from 'express';

import * as usersController from '../controllers/users-controller';

const router = new Router();

router.post('', usersController.createUser);

export default router;
