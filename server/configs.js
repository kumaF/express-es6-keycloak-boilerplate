/* eslint-disable no-console*/
'use strict';

import dotenv from 'dotenv';

dotenv.config();

export const DECORATOR = process.env.DECORATOR;
export const PORT = process.env.PORT;

export const KEYCLOCK_CONFIGS = {
    KEYCLOAK_ADMIN_USERNAME: process.env.KEYCLOAK_ADMIN_USERNAME,
    KEYCLOAK_ADMIN_PASSWORD: process.env.KEYCLOAK_ADMIN_PASSWORD,
    KEYCLOAK_ADMIN_GRANT_TYPE: process.env.KEYCLOAK_ADMIN_GRANT_TYPE,
    KEYCLOAK_ADMIN_CLIENT_ID: process.env.KEYCLOAK_ADMIN_CLIENT_ID,


    KEYCLOAK_REALM: process.env.KEYCLOAK_REALM,
    KEYCLOAK_CLIENT_ID: process.env.KEYCLOAK_CLIENT_ID,
    KEYCLOAK_CLIENT_GRANT_TYPE: process.env.KEYCLOAK_CLIENT_GRANT_TYPE,
    KEYCLOAK_CLIENT_SECRET: process.env.KEYCLOAK_CLIENT_SECRET,
    

    KEYCLOAK_SERVER_URL: process.env.KEYCLOAK_SERVER_URL,
    KEYCLOAK_ISSUER_PATH: process.env.KEYCLOAK_ISSUER_PATH
};

export const MONGO_CONFIGS = {
    MONGO_HOST: process.env.MONGO_HOST,
    MONGO_PORT: process.env.MONGO_PORT,
    MONGO_DB_NAME: process.env.MONGO_DB_NAME,
    MONGO_TIMEOUT: process.env.MONGO_TIMEOUT
};

export const REGEXES = {
    PASSWORD: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/
};