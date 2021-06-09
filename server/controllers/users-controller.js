/* eslint-disable no-console*/
'use strict';

import regeneratorRuntime from 'regenerator-runtime';
import { StatusCodes } from 'http-status-codes';

import { validateUserCreateSchema } from '../validators';
import { kcInsertUser, kcRemoveUser } from '../keycloak';
import { dbInsertUser } from '../db';
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

		logger(e, 'error');
		data = await exceptionHandler(e);
	}

	return await buildResponse(res, data);
}

// export async function createUser(req, res) {
//     let data = {};
//     let userId = null;

//     try {
//         await validateUserCreateSchema(req.body);

//         let payload = req.body;
//         userId = await kcInsertUser({
//             firstName: payload.firstName,
//             lastName: payload.lastName,
//             username: payload.userName,
//             email: payload.email,
//             emailVerified: true,
//             enabled: true,
//             attributes: {
//                 mobileNo: payload.mobileNo
//             },
//             credentials:[
//                 {
//                     type:'password',
//                     value: payload.password,
//                     temporary: false
//                 }
//             ]
//         });

//         payload.userId = userId;
//         delete payload.password

//         await dbInsertUser(payload);

//         data = {
//             statusCode: StatusCodes.CREATED,
//             msg: 'New user created.'
//         };
//     } catch (e) {
//         if (userId !== null && e instanceof MongoError) {
//             await kcRemoveUser(userId);
//         }

//         logger(e, 'error')
//         data = await exceptionHandler(e);
//     }

//     return await buildResponse(res, data);
// }
