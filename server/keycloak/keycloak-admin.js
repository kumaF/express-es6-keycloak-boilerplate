/* eslint-disable no-console*/
'use strict';

import regeneratorRuntime from 'regenerator-runtime';
import KcAdminClient from 'keycloak-admin';
import { StatusCodes } from 'http-status-codes';

import { KeycloakError } from '../exceptions';
import { KEYCLOCK_CONFIGS } from '../configs';

export async function initKeycloakAdminClient(accessToken) {
	try {
		const kcAdminClient = new KcAdminClient({
			baseUrl: KEYCLOCK_CONFIGS.KEYCLOAK_SERVER_URL,
		});

		kcAdminClient.setAccessToken(accessToken);
		kcAdminClient.setConfig({
			realmName: KEYCLOCK_CONFIGS.KEYCLOAK_CLIENT_REALM,
		});

		return kcAdminClient;
	} catch (e) {
		throw new KeycloakError(
			e.response.data.error_description,
			StatusCodes.INTERNAL_SERVER_ERROR
		);
	}
}
