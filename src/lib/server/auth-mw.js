
import { redis } from "$lib/redis";

/**
 * 
 * @param {import("@sveltejs/kit").Cookies} cookies - ```RequestHandler.cookies``` object
 * @returns {Promise<boolean>} - ```true``` if user checked successfully, else ```false```
 */
export async function authMiddleware(cookies) {
    const cookieId = cookies.get("id");
    const cookieSid = cookies.get("session_id");

    if (!cookieId) {
        return false
    }

    if (!cookieSid) {
        return false
    }

    if (isNaN(parseInt(cookieId))) {
        return false
    }

    const redisUserId = await redis.get(cookieSid);
    if (redisUserId != cookieId) {
        return false
    }

    return true
}