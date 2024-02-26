// Upstash Redis
const upstashRedisRESTUrl = process.env.UPSTASH_REDIS_REST_URL;
const upstashRedisauthToken = process.env.UPSTASH_REDIS_REST_TOKEN;

exports.ENV = {
  upstashRedisRESTUrl,
  upstashRedisauthToken,
};
