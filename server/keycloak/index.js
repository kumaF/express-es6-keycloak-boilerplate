/* eslint-disable no-console*/
'use strict';

import { StatusCodes } from 'http-status-codes';
import { initKeycloakAdminClient } from './clients';
import { KeycloakError } from '../exceptions';

export async function kcInsertUser(payload) {
    let _keycloakAdminClient;
    let _kcUser;

    try {
        _keycloakAdminClient = await initKeycloakAdminClient();
        _kcUser = await _keycloakAdminClient.users.create(payload);

        return _kcUser.id;
    } catch (e) {
        if (e instanceof KeycloakError) {
            throw e;
        } else if (e.isAxiosError) {
            throw new KeycloakError(e.response.data.errorMessage, e.response.status);
        }
    }
}