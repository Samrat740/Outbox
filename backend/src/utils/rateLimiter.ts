import { redis } from "../config/redis";

export const canSendEmail = async () => {

  const key = `email_count:${Math.floor(Date.now() / 3600000)}`;
  const limit = Number(process.env.MAX_EMAILS_PER_HOUR);

  // ⭐ Atomic increment
  const currentCount = await redis.incr(key);

  // Set expiry ONLY when key is new
  if (currentCount === 1) {
    await redis.expire(key, 3600);
  }

  console.log(`📊 Emails sent this hour: ${currentCount}/${limit}`);

  if (currentCount > limit) {
    return false;
  }

  return true;
};
