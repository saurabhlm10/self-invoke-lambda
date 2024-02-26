const { fetchRedis } = require("./helpers/fetchRedis");
const { Lambda } = require("@aws-sdk/client-lambda");

// Initialize the Lambda client
const lambda = new Lambda({ region: "ap-south-1" });

module.exports.handler = async (event) => {
  const redisKey = "Testing-Lambda";

  const currentIndex = await fetchRedis("get", redisKey);

  console.log("Current Index", currentIndex);

  const maxSteps = 5; // Default max steps if not specified

  // Check if task is done
  if (currentIndex >= maxSteps) {
    // Task is complete
    console.log("Task completed.");
    return { statusCode: 200, body: "Task completed successfully." };
  }

  // Prepare to self-invoke for the next step
  const nextIndex = currentIndex + 1;

  await fetchRedis("set", redisKey, String(nextIndex));
  const payload = {
    index: nextIndex,
    maxSteps: maxSteps,
  };

  try {
    // Self-invoke asynchronously
    await lambda.invoke({
      FunctionName: process.env.AWS_LAMBDA_FUNCTION_NAME, // Ensure AWS_LAMBDA_FUNCTION_NAME is defined in the environment variables
      InvocationType: "Event", // Asynchronous invocation
      Payload: JSON.stringify(payload),
    });

    console.log(`Successfully self-invoked for step ${nextIndex}`);
    return {
      statusCode: 200,
      body: `Step ${currentIndex} processed. Continuing to step ${nextIndex}.`,
    };
  } catch (error) {
    console.error("Error self-invoking Lambda", error);
    return { statusCode: 500, body: "Failed to self-invoke Lambda function." };
  }
};
