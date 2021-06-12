/* eslint-disable no-console*/
'use strict';

import KcAdminClient from 'keycloak-admin';
import { StatusCodes } from 'http-status-codes';

import { KeycloakError } from '../exceptions';
import { KEYCLOCK_CONFIGS } from '../configs';

export async function initKeycloakAdminClient() {
	try {
		const kcAdminClient = new KcAdminClient();

		await kcAdminClient.auth({
			username: KEYCLOCK_CONFIGS.KEYCLOAK_ADMIN_USERNAME,
			password: KEYCLOCK_CONFIGS.KEYCLOAK_ADMIN_PASSWORD,
			grantType: KEYCLOCK_CONFIGS.KEYCLOAK_ADMIN_GRANT_TYPE,
			clientId: KEYCLOCK_CONFIGS.KEYCLOAK_ADMIN_CLIENT_ID,
		});

		kcAdminClient.setConfig({
			realmName: KEYCLOCK_CONFIGS.KEYCLOAK_REALM,
		});

		return kcAdminClient;
	} catch (e) {
		throw new KeycloakError(
			e.response.data.error_description,
			StatusCodes.INTERNAL_SERVER_ERROR
		);
	}
}
