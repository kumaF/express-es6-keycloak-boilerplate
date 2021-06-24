/* eslint-disable no-console*/
'use strict';

import regeneratorRuntime from 'regenerator-runtime';
import { Issuer, custom } from 'openid-client';
import { StatusCodes } from 'http-status-codes';

import { OIdError } from '../exceptions';
import { KEYCLOCK_CONFIGS } from '../configs';

custom.setHttpOptionsDefaults({
	timeout: 60000,
});

export async function initOpenIdClient() {
	const issuerUrl = `${KEYCLOCK_CONFIGS.KEYCLOAK_SERVER_URL}/${KEYCLOCK_CONFIGS.KEYCLOAK_ISSUER_PATH}/${KEYCLOCK_CONFIGS.KEYCLOAK_CLIENT_REALM}`;

	try {
		const keycloakIssuer = await Issuer.discover(issuerUrl);
		const oidClient = new keycloakIssuer.Client({
			client_id: KEYCLOCK_CONFIGS.KEYCLOAK_CLIENT_ID,
			token_endpoint_auth_method: 'none',
		});

		return oidClient;
	} catch (e) {
		throw new OIdError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
	}
}

export async function initOpenIdAdmin() {
	const issuerUrl = `${KEYCLOCK_CONFIGS.KEYCLOAK_SERVER_URL}/${KEYCLOCK_CONFIGS.KEYCLOAK_ISSUER_PATH}/${KEYCLOCK_CONFIGS.KEYCLOAK_ADMIN_REALM}`;

	try {
		const keycloakIssuer = await Issuer.discover(issuerUrl);
		const oidClient = new keycloakIssuer.Client({
			client_id: KEYCLOCK_CONFIGS.KEYCLOAK_ADMIN_CLIENT_ID,
			token_endpoint_auth_method: 'none',
		});

		return oidClient;
	} catch (e) {
		throw new OIdError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
	}
}
