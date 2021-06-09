/* eslint-disable no-console*/
'use strict';

import regeneratorRuntime from 'regenerator-runtime';
import { ValidationError } from 'joi';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { CustomError } from './exceptions';
import { logger } from './logger';
import mongoose from 'mongoose';

export async function buildResponse(res, dataDict) {
	let data = dataDict.data ? dataDict.data : null;
	let msg = dataDict.msg ? dataDict.msg : null;
	let success =
		typeof dataDict.success !== 'undefined' ? dataDict.success : true;
	let statusCode = dataDict.statusCode ? dataDict.statusCode : StatusCodes.OK;

	if (data && msg) {
		res.status(statusCode).send({
			success: success,
			payload: data,
			detail: msg,
		});
	} else if (data) {
		res.status(statusCode).send({
			success: success,
			payload: data,
		});
	} else if (msg) {
		res.status(statusCode).send({
			success: success,
			detail: msg,
		});
	}
}

export async function exceptionHandler(error) {
	let data = {};

	if (error instanceof CustomError) {
		data = {
			statusCode: error.status,
			msg: error.message,
			success: false,
		};
	} else {
		data = {
			statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
			msg: error.message,
			success: false,
		};
	}

	logger(error.message, 'error');
	return data;
}
