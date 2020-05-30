import { Request, Response, NextFunction } from 'express';

import AppError from '../errors/AppError';

export default (
    error: Error,
    request: Request,
    response: Response,
    _: NextFunction,
): Response<any> => {
    if (error instanceof AppError) {
        return response.status(error.statusCode).json({
            status: 'error',
            message: error.message,
        });
    }

    return response.status(500).json({
        status: 'error',
        message: 'Internal server error',
    });
};
