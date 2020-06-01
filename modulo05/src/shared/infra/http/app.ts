import 'reflect-metadata';
import express from 'express';
import 'express-async-errors';
import cors from 'cors';

import uploadConfig from '@config/upload';
import routes from './routes';

import '@shared/infra/typeorm';
import '@shared/container';

import HandleExceptionMiddleware from './middlewares/HandleException';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.directory));
app.use(routes);

app.use(HandleExceptionMiddleware);

export default app;
