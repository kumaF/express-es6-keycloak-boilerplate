/* eslint-disable no-console*/
'use strict';

import regeneratorRuntime from 'regenerator-runtime';
import { StatusCodes } from 'http-status-codes';
import { errors } from 'openid-client';
import { initKeycloakAdminClient } from './keycloak-admin';
import { initOpenIdClient, initOpenIdAdmin } from './open-id-client';
import { initKeycloakClient } from './keycloak-client';
import { KeycloakError, OIdError } from '../exceptions';
import { KEYCLOCK_CONFIGS } from '../configs';
import { logger } from '../logger';

var _keycloakClient;
var _keycloakAdminClient;
var _oidClient;
var _oidAdmin;

var _refreshToken;

export async function kcInsertUser(payload) {
	let _kcUser;

	try {
		_kcUser = await _keycloakAdminClient.users.create(payload);

		return _kcUser.id;
	} catch (e) {
		if (e instanceof KeycloakError) {
			throw e;
		} else if (e.isAxiosError && e.response.status === 401) {
			let accessToken = await oidAdminRefreshToken();

			_keycloakAdminClient.setAccessToken(accessToken);
			_kcUser = await _keycloakAdminClient.users.create(payload);

			return _kcUser.id;
		} else if (e.isAxiosError) {
			throw new KeycloakError(
				e.response.data.errorMessage,
				e.response.status
			);
		}
	}
}

export async function kcRemoveUser(id) {
	try {
		await _keycloakAdminClient.users.del({ id: id });
	} catch (e) {
		if (e instanceof KeycloakError) {
			throw e;
		} else if (e.isAxiosError && e.response.status === 401) {
			let accessToken = await oidAdminRefreshToken();

			_keycloakAdminClient.setAccessToken(accessToken);
			await _keycloakAdminClient.users.del({ id: id });
		} else if (e.isAxiosError) {
			throw new KeycloakError(
				e.response.data.errorMessage,
				e.response.status
			);
		}
	}
}

export async function kcUpdateUser(id, payload) {
	try {
		await _keycloakAdminClient.users.update({ id: id }, payload);
	} catch (e) {
		if (e instanceof KeycloakError) {
			throw e;
		} else if (e.isAxiosError && e.response.status === 401) {
			let accessToken = await oidAdminRefreshToken();

			_keycloakAdminClient.setAccessToken(accessToken);
			await _keycloakAdminClient.users.update({ id: id }, payload);
		} else if (e.isAxiosError) {
			throw new KeycloakError(
				e.response.data.errorMessage,
				e.response.status
			);
		}
	}
}

export async function oidAccessToken(payload) {
	try {
		payload.grant_type = KEYCLOCK_CONFIGS.KEYCLOAK_CLIENT_GRANT_TYPE;
		payload.client_secret = KEYCLOCK_CONFIGS.KEYCLOAK_CLIENT_SECRET;

		let tokenSet = await _oidClient.grant(payload);
		return { ...tokenSet };
	} catch (e) {
		if (e instanceof OIdError) {
			throw e;
		} else if (e instanceof errors.OPError) {
			if (e.error === 'invalid_grant') {
				throw new OIdError(
					e.error_description,
					StatusCodes.UNAUTHORIZED
				);
			} else {
				throw new OIdError(
					e.message,
					StatusCodes.INTERNAL_SERVER_ERROR
				);
			}
		}
	}
}

export async function oidRefreshToken(refreshToken) {
	try {
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
				throw new OIdError(
					e.error_description,
					StatusCodes.UNAUTHORIZED
				);
			} else {
				throw new OIdError(
					e.message,
					StatusCodes.INTERNAL_SERVER_ERROR
				);
			}
		}
	}
}

export async function oidAdminRefreshToken(forced=false) {
	try {
		logger('refreshing open-id admin token...');

		let tokenSet = await _oidAdmin.refresh(_refreshToken);
		_refreshToken = tokenSet.refresh_token;

		logger('open-id admin token refreshed');
		
		if (!forced) {
			return tokenSet.access_token;
		} else {
			_keycloakAdminClient.setAccessToken(tokenSet.access_token);
		}
	} catch (e) {
		if (e instanceof OIdError) {
			throw e;
		} else if (e instanceof errors.OPError) {
			if (e.error === 'invalid_grant') {
				let tokenSet = await initKeycloakAdmin(true);

				_refreshToken = tokenSet.refresh_token;
				
				if (!forced) {
					return tokenSet.access_token;
				} else {
					_keycloakAdminClient.setAccessToken(tokenSet.access_token);
				}
			} else {
				throw new OIdError(
					e.message,
					StatusCodes.INTERNAL_SERVER_ERROR
				);
			}
		}
	}
}

export function initKeycloak() {
	if (_keycloakClient) {
		logger('keycloak client already initialized', 'warn');
	}

	_keycloakClient = initKeycloakClient();
}

export function getKeycloakClient() {
	if (!_keycloakClient) {
		initKeycloak();
	}

	return _keycloakClient;
}

export async function initOidClient() {
	logger('initializing open-id client...', 'info');
	if (_oidClient) {
		logger('open-id client already initialized', 'warn');
	}

	_oidClient = await initOpenIdClient();
	logger('open-id client successfully initialized', 'info');
}

export async function initOidAdmin() {
	logger('initializing open-id admin...', 'info');
	if (_oidAdmin) {
		logger('open-id admin already initialized', 'warn');
	}

	_oidAdmin = await initOpenIdAdmin();
	logger('open-id admin successfully initialized', 'info');
}

export async function initKeycloakAdmin(force=false) {
	if (_keycloakAdminClient && !force) {
		logger('keycloak admin client already initialized', 'warn');
	}

	try {
		logger('initializing keycloak admin client...', 'info');

		let tokenSet = await _oidAdmin.grant({
			grant_type: KEYCLOCK_CONFIGS.KEYCLOAK_ADMIN_GRANT_TYPE,
			username: KEYCLOCK_CONFIGS.KEYCLOAK_ADMIN_USERNAME,
			password: KEYCLOCK_CONFIGS.KEYCLOAK_ADMIN_PASSWORD,
		});

		if (force) {
			return tokenSet;
		} else {
			_keycloakAdminClient = await initKeycloakAdminClient(
				tokenSet.access_token
			);
	
			_refreshToken = tokenSet.refresh_token;
		}

		logger('keycloak admin client successfully initialized', 'info');
	} catch (e) {
		logger(e.message, 'error');
	}
}
