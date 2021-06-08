import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import healthRouter from './routes/health-routes';

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/v0.1/health', healthRouter);

export default app;