/* eslint-disable no-console*/
'use strict';

import regeneratorRuntime from 'regenerator-runtime';
import { StatusCodes } from 'http-status-codes';

import User from '../models/users-models';
import { MongoError } from '../exceptions';

export async function dbInsertUser(payload) {
	await User.create(payload).catch((err) => {
		throw new MongoError(err.message, StatusCodes.INTERNAL_SERVER_ERROR);
	});
}

export async function dbGetUserByKey(filter, project = {}) {
	try {
		const doc = await User.findOne(filter, project).exec();

		if (doc === null) {
			throw new MongoError(
				'invalid credentials',
				StatusCodes.UNAUTHORIZED
			);
		}

		return doc;
	} catch (err) {
		if (err instanceof MongoError) {
			throw err;
		}

		throw new MongoError(err.message, StatusCodes.INTERNAL_SERVER_ERROR);
	}
}
