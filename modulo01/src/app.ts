import 'reflect-metadata';
import express from 'express';
import 'express-async-errors';

import routes from './routes';

import './database';
import uploadConfig from './config/upload';

import HandleExceptionMiddleware from './middlewares/HandleException';

const app = express();

app.use(express.json());
app.use('/files', express.static(uploadConfig.directory));
app.use(routes);

app.use(HandleExceptionMiddleware);

export default app;
