import 'reflect-metadata';
import 'dotenv/config';
import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import { errors } from 'celebrate';

import uploadConfig from '@config/upload';
import routes from './routes';

import '@shared/infra/typeorm';
import '@shared/container';

import HandleExceptionMiddleware from './middlewares/HandleException';
import RateLimiterMiddleware from './middlewares/RateLimiter';

const app = express();

app.use(RateLimiterMiddleware);
app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.tmpFolder));
app.use(routes);

app.use(errors());
app.use(HandleExceptionMiddleware);

export default app;
