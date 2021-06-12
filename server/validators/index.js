/* eslint-disable no-console*/
'use strict';

import { StatusCodes } from 'http-status-codes';

import { userCreateSchema, userUpdateSchema } from './users-validators';
import { tokenGenSchema } from './auth-validators';
import { ValidateError } from '../exceptions';

export async function validateUserCreateSchema(payload) {
	try {
		await userCreateSchema.validateAsync(payload);
	} catch (e) {
		let message = e.details[0].message;
		throw new ValidateError(message, StatusCodes.UNPROCESSABLE_ENTITY);
	}
}

export async function validateTokenGenSchema(payload) {
	try {
		await tokenGenSchema.validateAsync(payload);
	} catch (e) {
		let message = e.details[0].message;
		throw new ValidateError(message, StatusCodes.UNPROCESSABLE_ENTITY);
	}
}

export async function validateUserUpdateSchema(payload) {
	try {
		await userUpdateSchema.validateAsync(payload);
	} catch (e) {
		let message = e.details[0].message;
		throw new ValidateError(message, StatusCodes.UNPROCESSABLE_ENTITY);
	}
}
