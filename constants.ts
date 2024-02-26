import { getDaysInCurrentMonth } from "./helpers/getDaysInCurrentMonth";

// MongoDB
const MONGO_URL = process.env.MONGO_URL as string;
const limit = process.env.LIMIT;

// Upstash Redis
const upstashRedisRESTUrl = process.env.UPSTASH_REDIS_REST_URL;
const upstashRedisauthToken = process.env.UPSTASH_REDIS_REST_TOKEN;

const months = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

const daysInCurrentMonth = getDaysInCurrentMonth();
const postsPerMonth = 2;
const postsPerDay = Number(process.env.POSTS_PER_DAY as string);
// const postsPerMonth = postsPerDay * daysInCurrentMonth;

// APIFY
const APIFY_KEY = process.env.APIFY_KEY;
const apifyPerUsernameResultLimit = Number(
  process.env.APIFY_PER_USERNAME_RESULT_LIMIT
);

// Cloudinary
const cloudinary_cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
const cloudinary_api_key = process.env.CLOUDINARY_API_KEY;
const cloudinary_api_secret = process.env.CLOUDINARY_API_SECRET;

export const ENV = {
  MONGO_URL,
  upstashRedisRESTUrl,
  upstashRedisauthToken,
  months,
  postsPerMonth,
  limit,
  APIFY_KEY,
  apifyPerUsernameResultLimit,
  cloudinary_cloud_name,
  cloudinary_api_key,
  cloudinary_api_secret,
};
