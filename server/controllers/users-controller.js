/* eslint-disable no-console*/
'use strict';

import regeneratorRuntime from 'regenerator-runtime';
import { StatusCodes } from 'http-status-codes';
import lodash from 'lodash';

import {
	validateUserCreateSchema,
	validateUserUpdateSchema,
} from '../validators';
import { kcInsertUser, kcRemoveUser, kcUpdateUser } from '../keycloak';
import { dbInsertUser, dbGetUserByKey, dbUpdateUserByKey } from '../db';
import { MongoError } from '../exceptions';

import { buildResponse, exceptionHandler } from '../utils';
import { logger } from '../logger';

export async function createUser(req, res) {
	let data = {};
	let userId = null;

	try {
		await validateUserCreateSchema(req.body);

		let payload = req.body;
		userId = await kcInsertUser({
			firstName: payload.firstName,
			lastName: payload.lastName,
			username: payload.userName,
			email: payload.email,
			emailVerified: true,
			enabled: true,
			attributes: {
				mobileNo: payload.mobileNo,
			},
			credentials: [
				{
					type: 'password',
					value: payload.password,
					temporary: false,
				},
			],
		});

		payload.userId = userId;
		delete payload.password;

		await dbInsertUser(payload);

		data = {
			statusCode: StatusCodes.CREATED,
			msg: 'New user created.',
		};
	} catch (e) {
		if (userId !== null && e instanceof MongoError) {
			await kcRemoveUser(userId);
		}

		data = await exceptionHandler(e);
	}

	return await buildResponse(res, data);
}

export async function getCurrentUser(req, res) {
	let data = {};

	try {
		let token = req.kauth.grant.access_token.content;

		if (!token) {
			data = {
				statusCode: StatusCodes.UNAUTHORIZED,
				msg: 'not a valid token',
			};
		} else {
			let user = await dbGetUserByKey(
				{ userId: token.sub, isActive: true, isDelete: false },
				{ _id: 0, createdAt: 0, updatedAt: 0, isActive: 0, isDelete: 0 }
			);

			data = {
				statusCode: StatusCodes.OK,
				data: user,
			};
		}
	} catch (e) {
		data = await exceptionHandler(e);
	}

	return await buildResponse(res, data);
}

export async function updateUser(req, res) {
	let data = {};

	try {
		let token = req.kauth.grant.access_token.content;

		if (!token) {
			data = {
				statusCode: StatusCodes.UNAUTHORIZED,
				msg: 'not a valid token',
			};
		} else {
			await validateUserUpdateSchema(req.body);

			let payload = req.body;
			let updateBody = await _mapUpdateBody(payload);

			if (payload.hasOwnProperty('password')) {
				delete payload.password;
			}

			await kcUpdateUser(token.sub, updateBody);
			await dbUpdateUserByKey({ userId: token.sub }, payload);

			let user = await dbGetUserByKey(
				{ userId: token.sub, isActive: true, isDelete: false },
				{ _id: 0, createdAt: 0, updatedAt: 0, isActive: 0, isDelete: 0 }
			);

			data = {
				statusCode: StatusCodes.OK,
				data: user,
			};
		}
	} catch (e) {
		data = await exceptionHandler(e);
	}

	return await buildResponse(res, data);
}

async function _mapUpdateBody(data = {}) {
	let updateBody = {};

	if (data.hasOwnProperty('firstName')) {
		updateBody['firstName'] = data.firstName;
	}

	if (data.hasOwnProperty('lastName')) {
		updateBody['lastName'] = data.lastName;
	}

	if (data.hasOwnProperty('userName')) {
		updateBody['username'] = data.userName;
	}

	if (data.hasOwnProperty('email')) {
		updateBody['email'] = data.email;
	}

	if (data.hasOwnProperty('mobileNo')) {
		updateBody['attributes'] = { mobileNo: data.mobileNo };
	}

	if (data.hasOwnProperty('password')) {
		updateBody['credentials'] = [
			{ value: data.password, type: 'password' },
		];
	}

	return updateBody;
}
