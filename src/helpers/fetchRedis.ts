import axios from "axios";
import { ENV } from "../constants";

export const fetchRedis = async (command: string, ...args: string[]) => {
  const commandUrl = `${ENV.upstashRedisRESTUrl}/${command}/${args.join("/")}`;

  const response = await axios.get(commandUrl, {
    headers: {
      Authorization: `Bearer ${ENV.upstashRedisauthToken}`,
    },
  });

  if (response.statusText !== "OK") {
    throw new Error(`Error executing Redis command: ${response.statusText}`);
  }

  if (command === "get") {
    if (response.data.result) {
      console.log("REDIS RESPONSE", response.data.result);
      const jsonString = response.data.result.replace(/(\w+):/g, '"$1":');
      const data = JSON.parse(jsonString);
      return data;
    } else {
      return null;
    }
  }

  if (command === "set" || command === "zadd") return;
};
