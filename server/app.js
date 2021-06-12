/* eslint-disable no-console*/
'use strict';

import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import logger from 'morgan';
import cors from 'cors'

import './keycloak/init';
import './db/mongodb';

import healthRouter from './routes/health-routes';
import usersRoutes from './routes/users-routes';
import authRoutes from './routes/auth-routes';

import KeycloakClient from './keycloak/keycloak-client';
import { DECORATOR, KEYCLOCK_CONFIGS } from './configs';


var app = express();
var memoryStore = KeycloakClient.getMemoryStore();
var keycloak = KeycloakClient.getKeycloak();

console.log(keycloak)


app.use(session({
    secret: KEYCLOCK_CONFIGS.KEYCLOAK_CLIENT_SECRET,
    resave: false,
    saveUninitialized: true,
    store: memoryStore
}));

app.use(keycloak.middleware());
app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(`${DECORATOR}/health`, healthRouter);
app.use(`${DECORATOR}/users`, usersRoutes);
app.use(`${DECORATOR}/oauth`, authRoutes);

export default app;
