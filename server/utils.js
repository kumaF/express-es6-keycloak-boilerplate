/* eslint-disable no-console*/
'use strict';

import regeneratorRuntime from "regenerator-runtime";
import { ValidationError } from 'joi';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { KeycloakError } from './exceptions';
import { logger } from './logger';

export async function buildResponse(res, dataDict) {
    let data = dataDict.data ? dataDict.data : null;
    let msg = dataDict.msg ? dataDict.msg : null;
    let statusCode = dataDict.statusCode ? dataDict.statusCode : StatusCodes.OK;
    
    if (data && msg) {
        res.status(statusCode).send({
            success: true,
            payload: data,
            detail: msg
        });
    } else if (data) {
        res.status(statusCode).send({
            success: true,
            payload: data
        });
    } else if (msg) {
        res.status(statusCode).send({
            success: true,
            detail: msg
        });
    }
}

export async function exceptionHandler(error) {
    let data = {};

    if (error instanceof ValidationError) {
        data = {
            statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
            msg: error.details
        };

        logger(error.details, 'error');
    } else if (error instanceof KeycloakError) {
        data = {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            msg: error.message
        };

        logger(error.message, 'error');
    }


    return data;
}