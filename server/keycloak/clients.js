/* eslint-disable no-console*/
'use strict';

import { StatusCodes } from 'http-status-codes';
import { Issuer } from 'openid-client';
import  KcAdminClient from 'keycloak-admin';

import { KEYCLOCK_CONFIGS } from '../configs';
import { KeycloakError, OIdError } from '../exceptions';

export async function initKeycloakAdminClient() {
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
        throw new KeycloakError(e.response.data.error_description, StatusCodes.INTERNAL_SERVER_ERROR);
    }
};

export async function initOpenIdClient() {
    const issuerUrl = `${KEYCLOCK_CONFIGS.KEYCLOAK_SERVER_URL}/${KEYCLOCK_CONFIGS.KEYCLOAK_ISSUER_PATH}/${KEYCLOCK_CONFIGS.KEYCLOAK_REALM}`

    try {
        const keycloakIssuer = await Issuer.discover(issuerUrl);
        const oidClient = new keycloakIssuer.Client({
            client_id: KEYCLOCK_CONFIGS.KEYCLOAK_CLIENT_ID,
            token_endpoint_auth_method: 'none',
        });

        return oidClient;
    } catch (e) {
        throw new OIdError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}