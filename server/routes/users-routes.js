'use strict';

import { Router } from 'express';

import * as usersController from '../controllers/users-controller';
import { getKeycloakClient } from '../keycloak';

const router = new Router();
const keycloak = getKeycloakClient();

router.post('', usersController.createUser);
router.get(
	'/me',
	[keycloak.middleware(), keycloak.enforcer({ response_mode: 'token' })],
	usersController.getCurrentUser
);
router.patch(
	'',
	[keycloak.middleware(), keycloak.enforcer({ response_mode: 'token' })],
	usersController.updateUser
);

export default router;
