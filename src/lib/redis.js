import { Redis } from "@upstash/redis";
import { REDIS_URL, REDIS_TOKEN } from "$env/static/private"

const redis = new Redis({
    url: REDIS_URL,
    token: REDIS_TOKEN,
})

const data = await redis.set('foo', 'bar');