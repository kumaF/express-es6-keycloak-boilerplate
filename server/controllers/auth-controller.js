/* eslint-disable no-console*/
'use strict';

import regeneratorRuntime from 'regenerator-runtime';
import { StatusCodes } from 'http-status-codes';

import { validateTokenGenSchema } from '../validators';
import { buildResponse, exceptionHandler } from '../utils';
import { logger } from '../logger';
import { oidAccessToken, oidRefreshToken } from '../keycloak';
import { CustomError } from '../exceptions';
import { dbGetUserByKey } from '../db';

export async function generateAccessToken(req, res) {
	let data = {};

	try {
		await validateTokenGenSchema(req.body);

		let payload = req.body;
		let tokenSet = null;

		if (payload.grantType === 'password') {
			tokenSet = await _loginForAccessToken(payload.user);
		} else if (payload.grantType === 'refreshToken') {
			tokenSet = await oidRefreshToken(payload.refreshToken);
		}

		if (tokenSet !== null) {
			data = {
				statusCode: StatusCodes.OK,
				data: {
					accessToken: tokenSet.access_token,
					expiresAt: tokenSet.expires_at,
					refreshToken: tokenSet.refresh_token,
					tokenType: tokenSet.token_type,
					sessionState: tokenSet.session_state,
					scope: tokenSet.scope,
				},
			};
		}
	} catch (e) {
		logger(e, 'error');
		data = await exceptionHandler(e);
	}

	return await buildResponse(res, data);
}

async function _loginForAccessToken(payload) {
	let data = { password: payload.password };

	try {
		if (payload.userName) {
			data.username = payload.userName;
		} else if (payload.email) {
			let doc = await dbGetUserByKey({ email: payload.email });
			data.username = doc.userName;
		} else if (payload.mobileNo) {
			let doc = await dbGetUserByKey({ mobileNo: payload.mobileNo });
			data.username = doc.userName;
		}

		return await oidAccessToken(data);
	} catch (e) {
		if (e instanceof CustomError) {
			throw e;
		}

		throw new CustomError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
	}
}
