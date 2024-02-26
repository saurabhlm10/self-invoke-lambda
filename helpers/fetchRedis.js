const axios = require("axios");
const { ENV } = require("../constants.js");

exports.fetchRedis = async (command, ...args) => {
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
    console.log("REDIS RESPONSE", response.data.result);
    if (response.data.result) {
      const jsonString = response.data.result.replace(/(\w+):/g, '"$1":');
      const data = JSON.parse(jsonString);
      return data;
    } else {
      return null;
    }
  }

  if (command === "set" || command === "zadd") return;
};
