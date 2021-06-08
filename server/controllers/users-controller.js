/* eslint-disable no-console*/
'use strict';

import regeneratorRuntime from 'regenerator-runtime';
import { StatusCodes } from 'http-status-codes';

import { initKeycloakAdminCLient } from '../keycloak';
import { buildResponse } from '../utils';

export async function createUser(req, res) {
    let data = {
        statusCode: StatusCodes.OK,
        msg: 'Application is running successfully'
    };

    const keycloakAdminClient = await initKeycloakAdminCLient();
    let users = await keycloakAdminClient.users.find();

    console.log(users);

    return await buildResponse(res, data);
}