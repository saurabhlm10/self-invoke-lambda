import { Lambda } from "@aws-sdk/client-lambda";
import { fetchRedis } from "../helpers/fetchRedis";
import { getCurrentMonthYearName } from "../helpers/getCurrentMonthYearName";
import { RedisEntry, StatusValues } from "../types/RedisEntry.type";
import { ENV } from "../constants";
import { get10Pages } from "../helpers/get10Pages";
import { getReelsFromApify } from "../helpers/getReelsFromApify";
import { getFilteredReels } from "../helpers/getFilteredReels";
import { uploadReelToDB } from "../helpers/uploadReelToDB";
import connectToDb from "../config/db";
import IGPageModel from "../model/IGPage";

// Initialize the Lambda client
const lambda = new Lambda({ region: "ap-south-1" });

module.exports.handler = async (event: any) => {
  await connectToDb();

  const page = event.pathParameters?.page || event.page;
  // const page = "frenchiesforthewin";
  console.log("CURRENT PAGE", page);

  const mediaType = "reels";

  if (!(page || mediaType))
    return { message: "page and mediaType in required" };

  console.log("Getting Month-Year");

  // Get current Month Name
  const currentMonthYearName = getCurrentMonthYearName();

  const redisKey = page + "-" + currentMonthYearName + "-" + mediaType;

  // Object for maintaining state in Redis
  let redisEntry: RedisEntry = {
    postOffset: 0,
    pageOffset: 0,
    status: StatusValues.IN_PROGRESS,
    statusMessage: `Collecting posts for ` + redisKey,
  };

  try {
    // Check if page exists in DB
    const pageExists = await IGPageModel.exists({ name: page });

    if (!pageExists) {
      console.log("Page does not exist in DB");
      return { message: "Page does not exist in DB" };
    }
    // Get Current State from Redis
    const rawResponse = await fetchRedis("get", redisKey);

    console.log("rawResponse", rawResponse);

    if (!rawResponse) {
      // Create entry in Redis
      console.log("Creating Entry In Redis");
      await fetchRedis("set", redisKey, JSON.stringify(redisEntry));
    } else {
      console.log("Got Entry From Redis");
      redisEntry.postOffset = rawResponse.postOffset;
      redisEntry.pageOffset = rawResponse.pageOffset;
    }

    console.log("Number Of Posts To Collect", ENV.postsPerMonth);

    // If Posts are collected successfully
    if (redisEntry.postOffset >= ENV.postsPerMonth) {
      redisEntry.status = StatusValues.SUCCESS;
      redisEntry.statusMessage = "Collected Posts Successfully for " + redisKey;
      await fetchRedis("set", redisKey, JSON.stringify(redisEntry));
      console.log("Task completed.", redisKey);
      return {
        statusCode: 200,
        body: "Task completed successfully." + redisKey,
      };
    }

    // Get 10 DB entries sorted in descending order
    const collectionPages = await get10Pages(page, redisEntry.pageOffset);
    //   return "OK";

    const usernames = collectionPages!.map((page) => {
      return page.username;
    });

    console.log("usernames", usernames);

    // Get Reels from Apify
    const reels = await getReelsFromApify(usernames);

    console.log("Reels from Apify length", reels.length);

    // Filter out the reels by the criteria
    const filteredReels = await getFilteredReels(reels, usernames);

    console.log("Uploading reels to DB");

    await filteredReels.forEach(
      async (reel: InstagramPost) => await uploadReelToDB(reel, page)
    );

    redisEntry.postOffset = redisEntry.postOffset + filteredReels.length;
    redisEntry.pageOffset = redisEntry.pageOffset + Number(ENV.limit);
    redisEntry.status = StatusValues.IN_PROGRESS;
    redisEntry.statusMessage = "Collecting Posts for " + redisKey;
    await fetchRedis("set", redisKey, JSON.stringify(redisEntry));

    const payload = {
      page: page,
      mediaType: mediaType,
    };

    try {
      // Self-invoke asynchronously
      await lambda.invoke({
        FunctionName: process.env.AWS_LAMBDA_FUNCTION_NAME, // Ensure AWS_LAMBDA_FUNCTION_NAME is defined in the environment variables
        InvocationType: "Event", // Asynchronous invocation
        Payload: JSON.stringify(payload),
      });

      console.log(`Successfully self-invoked for step ${page}`);
      return {
        statusCode: 200,
        body: ` ${redisEntry.postOffset} Posts processed. Continuing to pages: ${redisEntry.pageOffset}.`,
      };
    } catch (error) {
      console.error("Error self-invoking Lambda", error);
      return {
        statusCode: 500,
        body: "Failed to self-invoke Lambda function.",
      };
    }
  } catch (error: any) {
    if (error instanceof Error) {
      console.log("In catch", error.message);
      redisEntry.status = StatusValues.ERROR;
      redisEntry.statusMessage = error.message;
      await fetchRedis("set", redisKey, JSON.stringify(redisEntry));
      return { message: error.message };
    } else {
      console.log("An unexpected error occurred", error);
      return { message: error.message };
    }
  }
};
