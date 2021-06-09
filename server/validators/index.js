/* eslint-disable no-console*/
'use strict';

import { StatusCodes } from 'http-status-codes';

import { userCreateSchema } from './users-validators';
import { tokenGenSchema } from './auth-validators';
import { ValidateError } from '../exceptions';

export async function validateUserCreateSchema(payload) {
    try {
        await userCreateSchema.validateAsync(payload);
    } catch (e) {
        let key = e.details[0].context.key;
        throw new ValidateError(`${key} is required`, StatusCodes.UNPROCESSABLE_ENTITY);
    }
}

export async function validateTokenGenSchema(payload) {
    try {
        await tokenGenSchema.validateAsync(payload);
    } catch (e) {
        let key = e.details[0].context.key;
        throw new ValidateError(`${key} is required`, StatusCodes.UNPROCESSABLE_ENTITY);
    }
}