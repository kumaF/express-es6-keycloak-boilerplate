/* eslint-disable no-console*/
'use strict';

import log from 'npmlog';

/**
 *  ===== log levels =====
 *  - silly
 *  - verbose
 *  - info
 *  - http
 *  - warn
 *  - error
 */

export function logger(msg, level = 'info') {
	const datetime = new Date().toISOString();
	log.log(level, datetime, msg);
}
