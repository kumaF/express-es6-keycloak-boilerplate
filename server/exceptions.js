/* eslint-disable no-console*/
'use strict';

import { StatusCodes } from 'http-status-codes';
import { logger } from './logger';
export class CustomError extends Error {
	constructor(message, status) {
		super(message);
		this.name = 'CustomError';
		this.status = status;
	}
}

export class KeycloakError extends CustomError {
	constructor(message, status) {
		super(message, status);
		this.name = 'KeycloakError';
	}
}

export class MongoError extends CustomError {
	constructor(message, status) {
		super(message, status);
		this.name = 'MongoError';
	}
}

export class ValidateError extends CustomError {
	constructor(message, status) {
		super(message, status);
		this.name = 'ValidateError';
	}
}

export class OIdError extends CustomError {
	constructor(message, status) {
		super(message, status);
		this.name = 'OIdError';
	}
}

export function exceptionHandler(error, req, res, next) {
	if (error instanceof CustomError) {
		logger(error.message, 'error');
		res.status(error.status).json({
			success: false,
			detail: error.message,
		});
	} else if (error instanceof TypeError) {
		logger(error.message, 'error');
		res.status(StatusCodes.UNAUTHORIZED).json({
			success: false,
			detail: error.message,
		});
	} else if (error instanceof Error) {
		logger(error.message, 'error');
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			success: false,
			detail: error.message,
		});
	} else {
		next(error);
	}
}
