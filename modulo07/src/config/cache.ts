import { RedisOptions } from 'ioredis';

interface ICacheConfig {
    driver: 'redis';
    providers: {
        redis: RedisOptions;
    };
}

export default {
    driver: process.env.CACHE_DRIVER,
    providers: {
        redis: {
            port: process.env.REDIS_PORT,
            host: process.env.REDIS_HOST,
        },
    },
} as ICacheConfig;
