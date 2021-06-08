/* eslint-disable no-console*/
'use strict';

import regeneratorRuntime from "regenerator-runtime";
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export async function buildResponse(res, dataDict) {
    let data = dataDict.data ? dataDict.data : null;
    let msg = dataDict.msg ? dataDict.msg : ReasonPhrases.OK;
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