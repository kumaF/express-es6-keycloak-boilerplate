/* eslint-disable no-console*/
'use strict';

import regeneratorRuntime from 'regenerator-runtime';
import mongoose from 'mongoose';

import { MONGO_CONFIGS } from '../configs';
import { logger } from '../logger';

mongoose.Promise = global.Promise;
const mongoUrl = `mongodb://${MONGO_CONFIGS.MONGO_HOST}:${MONGO_CONFIGS.MONGO_PORT}/${MONGO_CONFIGS.MONGO_DB_NAME}`;

mongoose
	.connect(mongoUrl, {
		auth: {
			user: '',
			password: ''
		},
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		connectTimeoutMS: MONGO_CONFIGS.MONGO_TIMEOUT,
		serverSelectionTimeoutMS: MONGO_CONFIGS.MONGO_TIMEOUT,
		authSource: 'admin'
	})
	.catch((err) =>
		logger(`database connection failed ::: ${err.message}`, 'error')
	);

mongoose.connection.once('connected', () =>
	logger('database connection established')
);
