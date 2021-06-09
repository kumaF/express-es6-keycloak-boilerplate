/* eslint-disable no-console*/
'use strict';

import regeneratorRuntime from 'regenerator-runtime';
import { StatusCodes } from 'http-status-codes';

import { validateUserCreateSchema } from '../validators';
import { kcInsertUser } from '../keycloak';
import { dbInsertUser } from '../db';

import { buildResponse, exceptionHandler } from '../utils';
import { logger } from '../logger';

export async function createUser(req, res) {
    let data = {};

    try {
        await validateUserCreateSchema(req.body);

        let payload = req.body;
        let userId = await kcInsertUser({
            firstName: payload.firstName,
            lastName: payload.lastName,
            username: payload.userName,
            email: payload.email,
            emailVerified: true,
            enabled: true,
            attributes: {
                mobileNo: payload.mobileNo
            },
            credentials:[
                {
                    type:'password', 
                    value: payload.password,
                    temporary: false
                }
            ]
        }); 

        payload.userId = userId;
        delete payload.password
        
        await dbInsertUser(payload);

        // data = {
        //     statusCode: StatusCodes.CREATED,
        //     msg: 'New user created.'
        // };

    } catch (e) {
        logger(e, 'error')
        data = await exceptionHandler(e);
    }

    return await buildResponse(res, data);
}