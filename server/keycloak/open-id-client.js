/* eslint-disable no-console*/
'use strict';

import { Issuer } from 'openid-client';
import { StatusCodes } from 'http-status-codes';

import { OIdError } from '../exceptions';
import { KEYCLOCK_CONFIGS } from '../configs';

export async function initOpenIdClient() {
	const issuerUrl = `${KEYCLOCK_CONFIGS.KEYCLOAK_SERVER_URL}/${KEYCLOCK_CONFIGS.KEYCLOAK_ISSUER_PATH}/${KEYCLOCK_CONFIGS.KEYCLOAK_REALM}`;

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