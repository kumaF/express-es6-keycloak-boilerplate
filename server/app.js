/* eslint-disable no-console*/
'use strict';

import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';

import './keycloak/init';
import './db/mongodb';

import healthRouter from './routes/health-routes';
import usersRoutes from './routes/users-routes';
import authRoutes from './routes/auth-routes';

import { exceptionHandler } from './exceptions';
import { DECORATOR } from './configs';

var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(`${DECORATOR}/health`, healthRouter);
app.use(`${DECORATOR}/users`, usersRoutes);
app.use(`${DECORATOR}/oauth`, authRoutes);

app.use(exceptionHandler);

export default app;
