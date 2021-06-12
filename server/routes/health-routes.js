'use strict';

import { Router } from 'express';

import * as healthController from '../controllers/health-controller';
import { getKeycloakClient } from '../keycloak';

const router = new Router();

router.get('', healthController.checkHealth);

export default router;
