/* eslint-disable no-console*/
'use strict';

import regeneratorRuntime from 'regenerator-runtime';
import { StatusCodes } from 'http-status-codes';

import { validateUserCreateSchema } from '../validators';
import { kcInsertUser, kcRemoveUser } from '../keycloak';
import { dbInsertUser, dbGetUserByKey } from '../db';
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
				{ userId: token.sub },
				{ _id: 0, isActive: 0, isDelete: 0, createdAt: 0, updatedAt: 0 }
			);
	
			data = {
				statusCode: StatusCodes.OK,
				data: user
			};
		}
	} catch (e) {
		data = await exceptionHandler(e);
	}

	return await buildResponse(res, data)
}
