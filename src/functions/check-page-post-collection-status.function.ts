import { AxiosError } from "axios";
import connectToDb from "../config/db";
import { getCurrentMonthYearName } from "../helpers/getCurrentMonthYearName";
import IGPageModel from "../model/IGPage";
import { fetchRedis } from "../helpers/fetchRedis";

module.exports.handler = async (event: any) => {
  await connectToDb();

  const page = event.pathParameters?.page;
  const mediaType = "reels";

  const currentMonthYearName = getCurrentMonthYearName();

  const redisKey = page + "-" + currentMonthYearName + "-" + mediaType;

  try {
    // Check if page exists in DB
    const pageExists = await IGPageModel.exists({ name: page });

    if (!pageExists) {
      console.log("Page does not exist in DB");
      return { message: "Page does not exist in DB" };
    }

    const rawResponse = await fetchRedis("get", redisKey);

    console.log("rawResponse", rawResponse);

    if (!rawResponse) {
      return {
        message: "No entry in Redis",
      };
    }

    return {
      status: rawResponse.status,
      statusMessage: rawResponse.statusMessage,
    };
  } catch (error: any) {
    if (error instanceof Error) {
      return {
        message: error.message,
      };
    }
  }
};
