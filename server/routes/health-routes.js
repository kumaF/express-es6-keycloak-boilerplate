'use strict';

import { Router } from 'express';

import * as healthController from '../controllers/health-controller';
import { getKeycloakClient } from '../keycloak';

const router = new Router();
const keycloak = getKeycloakClient();

router.get(
	'',
	[keycloak.middleware(), keycloak.protect()],
	healthController.checkHealth
);

export default router;
