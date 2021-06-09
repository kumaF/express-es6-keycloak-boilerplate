/* eslint-disable no-console*/
'use strict';

import regeneratorRuntime from 'regenerator-runtime';
import { StatusCodes } from 'http-status-codes';

import User from '../models/users-models';
import { MongoError } from '../exceptions';

export async function dbInsertUser(payload) {
    await User.create(payload).catch((err) => {
        throw new MongoError(err.message, StatusCodes.BAD_REQUEST);
    });
};