/* eslint-disable no-console*/
'use strict';

import regeneratorRuntime from 'regenerator-runtime';
import { StatusCodes } from 'http-status-codes';

import { validateTokenGenSchema } from '../validators';
import { buildResponse, exceptionHandler } from '../utils';
import { logger } from '../logger';
import { oidAccessToken } from '../keycloak';

export async function generateAccessToken(req, res) {
    let data = {}

    try {
        await validateTokenGenSchema(req.body);

        let payload = req.body;

        if (payload.grantType === 'password') {
            let tokenSet = await oidAccessToken({
                username: payload.user.userName,
                password: payload.user.password
            });

            data = {
                statusCode: StatusCodes.ACCEPTED,
                data: {
                    accessToken: tokenSet.access_token,
                    expiresAt: tokenSet.expires_at,
                    refreshToken: tokenSet.refresh_token,
                    tokenType: tokenSet.token_type,
                    sessionState: tokenSet.session_state,
                    scope: tokenSet.scope
                }
            };
        }
    } catch (e) {
        logger(e, 'error')
        data = await exceptionHandler(e);
    }

    return await buildResponse(res, data);
}