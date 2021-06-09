/* eslint-disable no-console*/
'use strict';

export class CustomError extends Error {
	constructor(message, status) {
		super(message);
		this.name = 'CustomError';
		this.status = status;
	}
}

export class KeycloakError extends CustomError {
	constructor(message, status) {
		super(message, status);
		this.name = 'KeycloakError';
	}
}

export class MongoError extends CustomError {
	constructor(message, status) {
		super(message, status);
		this.name = 'MongoError';
	}
}

export class ValidateError extends CustomError {
	constructor(message, status) {
		super(message, status);
		this.name = 'ValidateError';
	}
}

export class OIdError extends CustomError {
	constructor(message, status) {
		super(message, status);
		this.name = 'OIdError';
	}
}
