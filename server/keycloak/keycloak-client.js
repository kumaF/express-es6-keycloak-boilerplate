/* eslint-disable no-console*/
'use strict';

import regeneratorRuntime from 'regenerator-runtime';
import { MemoryStore } from 'express-session';
import Keycloak from 'keycloak-connect';
import { StatusCodes } from 'http-status-codes';

import { KeycloakError } from '../exceptions';
import { KEYCLOCK_CONFIGS } from '../configs';
import { logger } from '../logger';

export function initKeycloakClient() {
	logger('keycloak client initializing...');
	const keycloakConfig = {
		clientId: KEYCLOCK_CONFIGS.KEYCLOAK_CLIENT_ID,
		bearerOnly: true,
		serverUrl: KEYCLOCK_CONFIGS.KEYCLOAK_SERVER_URL,
		realm: KEYCLOCK_CONFIGS.KEYCLOAK_CLIENT_REALM,
		credentials: {
			secret: KEYCLOCK_CONFIGS.KEYCLOAK_CLIENT_SECRET,
		},
	};

	try {
		const memoryStore = new MemoryStore();
		const keycloakClient = new Keycloak(
			{ store: memoryStore },
			keycloakConfig
		);

		keycloakClient.redirectToLogin = () => {
			throw new KeycloakError('invalid token', StatusCodes.UNAUTHORIZED);
		};

		logger('keycloak client initialized');
		return keycloakClient;
	} catch (e) {
		logger(e.message, 'error');
	}
}
