/* eslint-disable no-console*/
'use strict';

export class KeycloakError extends Error {
    constructor(message) {
        super(message);
        this.name = 'KeycloakError'
    }
}