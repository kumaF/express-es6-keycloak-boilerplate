/* eslint-disable no-console*/
'use strict';

import { Unauthorized } from 'http-errors';
import session from 'express-session';
import Keycloak from 'keycloak-connect';

import { KEYCLOCK_CONFIGS } from '../configs';
import { logger } from '../logger';

let _keycloak;
let _memoryStore;

function initKeycloak() {
    if (_keycloak) {
        logger('trying to reinitialize keycloak', 'warn');
        return _keycloak;
    } 
    else {
        logger('initializing keycloak');
        var keycloakConfig = {
            bearerOnly: true,
            clientId: KEYCLOCK_CONFIGS.KEYCLOAK_CLIENT_ID,
            serverUrl: KEYCLOCK_CONFIGS.KEYCLOAK_SERVER_URL,
            realm: KEYCLOCK_CONFIGS.KEYCLOAK_SERVER_URL,
            credentials: {
                secret: KEYCLOCK_CONFIGS.KEYCLOAK_CLIENT_SECRET
            }
        };

        _memoryStore = new session.MemoryStore();

        _keycloak = new Keycloak({ store: _memoryStore }, keycloakConfig);
        _keycloak.redirectToLogin = () => {throw new Unauthorized('invalid token')};
        
		logger('keycloak initialization complete');
        return _keycloak;
    }
}

function getKeycloak() {
    if (!_keycloak){
        logger('keycloak has not been initialized', 'error');
    }

    return _keycloak;
}

function getMemoryStore() {
    if (!_memoryStore){
        logger('memory store has not been initialized', 'error');
    }

    return _memoryStore;
}

module.exports = {
    initKeycloak,
    getKeycloak,
    getMemoryStore
};