/* eslint-disable no-console*/
'use strict';

import regeneratorRuntime from 'regenerator-runtime';
import { StatusCodes } from 'http-status-codes';

import { initKeycloakAdminCLient } from '../keycloak';
import { buildResponse, exceptionHandler } from '../utils';
import { userCreateSchema } from '../validators/users-validators';

export async function createUser(req, res) {
    let data = {};

    try {
        await userCreateSchema.validateAsync(req.body);

        const keycloakAdminClient = await initKeycloakAdminCLient();

    } catch (e) {
        data = await exceptionHandler(e);
        return await buildResponse(res, data);
    }

    return await buildResponse(res, data);
}