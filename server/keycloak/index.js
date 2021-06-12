/* eslint-disable no-console*/
'use strict';

import { StatusCodes } from 'http-status-codes';
import { errors } from 'openid-client';
import { initKeycloakAdminClient } from './keycloak-admin';
import { initOpenIdClient } from './open-id-client';
import { KeycloakError, OIdError } from '../exceptions';
import { KEYCLOCK_CONFIGS } from '../configs';


export async function kcInsertUser(payload) {
	let _keycloakAdminClient;
	let _kcUser;

	try {
		_keycloakAdminClient = await initKeycloakAdminClient();
		_kcUser = await _keycloakAdminClient.users.create(payload);

		return _kcUser.id;
	} catch (e) {
		if (e instanceof KeycloakError) {
			throw e;
		} else if (e.isAxiosError) {
			throw new KeycloakError(e.response.data.errorMessage, e.response.status);
		}
	}
}

export async function kcRemoveUser(id) {
	let _keycloakAdminClient;

	try {
		_keycloakAdminClient = await initKeycloakAdminClient();
		await _keycloakAdminClient.users.del({ id: id });
	} catch (e) {
		if (e instanceof KeycloakError) {
			throw e;
		} else if (e.isAxiosError) {
			throw new KeycloakError(e.response.data.errorMessage, e.response.status);
		}
	}
}

export async function oidAccessToken(payload) {
	let _oidClient;

	try {
		_oidClient = await initOpenIdClient();

		payload.grant_type = KEYCLOCK_CONFIGS.KEYCLOAK_CLIENT_GRANT_TYPE;
		payload.client_secret = KEYCLOCK_CONFIGS.KEYCLOAK_CLIENT_SECRET;

		let tokenSet = await _oidClient.grant(payload);
		return { ...tokenSet };
	} catch (e) {
		if (e instanceof OIdError) {
			throw e;
		} else if (e instanceof errors.OPError) {
			if (e.error === 'invalid_grant') {
				throw new OIdError(e.error_description, StatusCodes.UNAUTHORIZED);
			} else {
				throw new OIdError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
			}
		}
	}
}

export async function oidRefreshToken(refreshToken) {
	let _oidClient;

	try {
		_oidClient = await initOpenIdClient();

		let tokenSet = await _oidClient.refresh(refreshToken, {
			exchangeBody: {
				client_secret: KEYCLOCK_CONFIGS.KEYCLOAK_CLIENT_SECRET,
			},
		});

		return { ...tokenSet };
	} catch (e) {
		if (e instanceof OIdError) {
			throw e;
		} else if (e instanceof errors.OPError) {
			if (e.error === 'invalid_grant') {
				throw new OIdError(e.error_description, StatusCodes.UNAUTHORIZED);
			} else {
				throw new OIdError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
			}
		}
	}
}