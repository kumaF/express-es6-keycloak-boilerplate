/* eslint-disable no-console*/
'use strict';

import joi from 'joi';

import { REGEXES } from '../configs';

export const userCreateSchema = joi.object({
	firstName: joi.string().required(),
	lastName: joi.string().required(),
	userName: joi.string().required(),
	email: joi.string().email().required(),
	mobileNo: joi.string().required(),
	// postalCode: joi.string().required(),
	password: joi.string().regex(REGEXES.PASSWORD).required(),
});

export const userUpdateSchema = joi.object({
	firstName: joi.string(),
	lastName: joi.string(),
	userName: joi.string(),
	email: joi.string().email(),
	mobileNo: joi.string(),
	// postalCode: joi.string().required(),
	password: joi.string().regex(REGEXES.PASSWORD),
});
