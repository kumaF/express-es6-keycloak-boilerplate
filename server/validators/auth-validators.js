/* eslint-disable no-console*/
'use strict';

import joi from 'joi';

const passwordSchema = joi.object({
    userName: joi.string(),
    email: joi.string(),
    mobileNo: joi.string(),
    password: joi.string().required()
}).min(2);

export const tokenGenSchema = joi.object({
    grantType: joi.string().required(),
    refreshToken: joi.alternatives().conditional('grantType', {
        is: 'refreshToken',
        then: joi.string().required(),
        otherwise: joi.string().allow('', null)
    }),
    user: joi.alternatives().conditional('grantType', {
        is: 'password',
        then: passwordSchema,
        otherwise: joi.string().allow('', null)
    }),
});