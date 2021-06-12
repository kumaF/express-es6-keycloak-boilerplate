'use strict';

import { Router } from 'express';

import * as healthController from '../controllers/health-controller';
import KeycloakClient from '../keycloak/keycloak-client';

const router = new Router();
const keycloak = KeycloakClient.getKeycloak();

router.get('', [keycloak.middleware(), keycloak.protect()], healthController.checkHealth);

export default router;
