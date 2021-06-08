'use strict';

import { Router } from 'express';

import * as authController from '../controllers/auth-controller';

const router = new Router();

router.get('', authController.generateAccessToken);

export default router;