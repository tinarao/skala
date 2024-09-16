
import { redis } from "$lib/redis";

/** @returns {bool} - ```true``` if user checked successfully, else ```false``` */
/** @param {import("@sveltejs/kit").Cookies} cookies */
export async function authMiddleware(cookies) {
    const cookieId = cookies.get("id");
    const cookieSid = cookies.get("session_id");

    if (!cookieId) {
        return false
    }

    if (!cookieSid) {
        return false
    }

    const redisUserId = await redis.get(cookieSid);
    if (redisUserId != cookieId) {
        return false
    }

    return true
}