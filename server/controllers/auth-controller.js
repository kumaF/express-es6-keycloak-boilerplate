/* eslint-disable no-console*/
'use strict';

import regeneratorRuntime from 'regenerator-runtime';
import { StatusCodes } from 'http-status-codes';

import { initOpenIdClient } from '../keycloak';
import { buildResponse } from '../utils';
import { KEYCLOCK_CONFIGS } from '../configs';

export async function generateAccessToken(req, res) {
    const openIdClient = await initOpenIdClient();
    let tokenSet = await openIdClient.grant({
        grant_type: KEYCLOCK_CONFIGS.KEYCLOAK_CLIENT_GRANT_TYPE,
        username: 'kumaf',
        password: 'pass@123',
        client_secret: KEYCLOCK_CONFIGS.KEYCLOAK_CLIENT_SECRET
    });

    let data = {
        statusCode: StatusCodes.OK,
        data: {...tokenSet}
    };

    return await buildResponse(res, data);
}