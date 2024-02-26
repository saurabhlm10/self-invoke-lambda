import { ApifyClient } from "apify-client";
import { ENV } from "../constants";

// Initialize the ApifyClient with API token
const client = new ApifyClient({
  token: ENV.APIFY_KEY,
});

export const getReelsFromApify = async (usernames: string[]) => {
  console.log("getting reels from apify");

  // Prepare Actor input
  const input = {
    username: usernames,
    resultsLimit: ENV.apifyPerUsernameResultLimit,
  };

  // Run the Actor and wait for it to finish
  const run = await client.actor("xMc5Ga1oCONPmWJIa").call(input);

  // Fetch and print Actor results from the run's dataset (if any)
  console.log("Results from dataset");
  const { items } = await client.dataset(run.defaultDatasetId).listItems();

  return items;
};
