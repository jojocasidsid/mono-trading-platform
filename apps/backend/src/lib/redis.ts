import { Redis } from 'ioredis';

const redis_url = process.env.REDIS_URL;

if (!redis_url) {
  throw new Error('REDIS_URL is required');
}

const redis = new Redis(redis_url, {
  maxRetriesPerRequest: 3,
});

redis.on('connect', () => {
  console.log('Redis connected');
});

redis.on('error', error => {
  console.error('Redis error:', error);
});

export default redis;
