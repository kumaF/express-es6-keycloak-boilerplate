/* eslint-disable no-console*/
'use strict';

import regeneratorRuntime from "regenerator-runtime";
import { StatusCodes } from 'http-status-codes';

import { buildResponse } from '../utils';

export async function checkHealth(req, res) {
    let data = {
        statusCode: StatusCodes.OK,
        msg: 'Application is running successfully'
    };

    return await buildResponse(res, data);
}