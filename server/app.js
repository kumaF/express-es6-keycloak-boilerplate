/* eslint-disable no-console*/
'use strict';

import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import { DECORATOR } from './configs';
import './db/mongodb';

import healthRouter from './routes/health-routes';
import usersRoutes from './routes/users-routes';
import authRoutes from './routes/auth-routes';

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(`${DECORATOR}/health`, healthRouter);
app.use(`${DECORATOR}/users`, usersRoutes);
app.use(`${DECORATOR}/oauth`, authRoutes);

export default app;