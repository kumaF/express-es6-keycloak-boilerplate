/* eslint-disable no-console*/
'use strict';

import mongoose from 'mongoose';
const { Schema } = mongoose;

const UserSchema = new Schema(
	{
		userId: {
			type: String,
			unique: true,
			required: true,
			index: true,
		},
		firstName: {
			type: String,
			required: true,
			trim: true,
		},
		lastName: {
			type: String,
			required: true,
			trim: true,
		},
		userName: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			unique: true,
			required: true,
			trim: true,
			index: true,
		},
		mobileNo: {
			type: String,
			unique: true,
			required: true,
			trim: true,
			index: true,
		},
		favourites: [
			{
				type: String,
			},
		],
		isActive: {
			type: Boolean,
			default: false,
		},
		isDelete: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true, versionKey: false }
);

export default mongoose.model('User', UserSchema);
