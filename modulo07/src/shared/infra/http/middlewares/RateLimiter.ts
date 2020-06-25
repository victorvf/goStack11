import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import AppError from '@shared/errors/AppError';

const redisClient = new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
});

const rateLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'ratelimiter',
    points: 5,
    duration: 1,
    blockDuration: 100,
});

const RateLimiterMiddleware = async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        await rateLimiter.consume(request.ip);

        return next();
    } catch (err) {
        throw new AppError('Too many requests', 429);
    }
};

export default RateLimiterMiddleware;
