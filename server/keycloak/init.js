/* eslint-disable no-console*/
'use strict';

import regeneratorRuntime from 'regenerator-runtime';
import { initOidClient, initOidAdmin, initKeycloakAdmin, oidAdminRefreshToken } from './index';
import { logger } from '../logger';

(async () => {
	await initOidClient();
	await initOidAdmin();
	await initKeycloakAdmin();


	setInterval(async () => {
		logger('--- periodic tokens refresh ---');
		await oidAdminRefreshToken(true);
	}, 55 * 1000);
})();
