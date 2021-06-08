/* eslint-disable no-console*/
'use strict';

import { Issuer } from 'openid-client';
import { KcAdminClient } from 'keycloak-admin';

import { logger } from './logger';
import { KEYCLOCK_CONFIGS } from './configs';

export async function initKeycloakAdminCLient() {
    try {
        const kcAdminClient = new KcAdminClient();

        await kcAdminClient.auth({
            username: KEYCLOCK_CONFIGS.KEYCLOAK_ADMIN_USERNAME,
            password: KEYCLOCK_CONFIGS.KEYCLOAK_ADMIN_PASSWORD,
            grantType: KEYCLOCK_CONFIGS.KEYCLOAK_ADMIN_GRANT_TYPE,
            clientId: KEYCLOCK_CONFIGS.KEYCLOAK_ADMIN_CLIENT_ID
        })

        kcAdminClient.setConfig({
            realmName: KEYCLOCK_CONFIGS.KEYCLOAK_REALM
        });

        return kcAdminClient;
    } catch (e) {
        logger(e, 'error');
    }
};

export async function initOpenIdClient() {
    const issuerUrl = `${KEYCLOCK_CONFIGS.KEYCLOAK_SERVER_URL}/${KEYCLOCK_CONFIGS.KEYCLOAK_ISSUER_PATH}/${KEYCLOCK_CONFIGS.KEYCLOAK_REALM}`
    const keycloakIssuer = await Issuer.discover(issuerUrl);

    const oidClient = new keycloakIssuer.Client({
        client_id: KEYCLOCK_CONFIGS.KEYCLOAK_CLIENT_ID,
        token_endpoint_auth_method: 'none',
    });

    return oidClient;
}