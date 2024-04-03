const topicNameOrId = process.env.PUBSUB_TOPIC_NAME || "verify-email";

// Imports the Google Cloud client library
const { PubSub } = require("@google-cloud/pubsub");
const logger = require("./logger");

// Creates a client; cache this for further use
const pubSubClient = new PubSub();

async function publishMessage(data) {
  // Publishes the message as a string, e.g. "Hello, world!" or JSON.stringify(someObject)
  const dataBuffer = Buffer.from(data);

  try {
    const messageId = await pubSubClient
      .topic(topicNameOrId)
      .publishMessage({ data: dataBuffer });
    logger.info({
      message: `Message ${messageId} published. Data: ${dataBuffer}`,
      function: "publishMessage",
    });
  } catch (error) {
    logger.error({
      error: `Received error while publishing: ${error.message}`,
      function: "publishMessage",
    });
    process.exitCode = 1;
  }
}

module.exports = publishMessage;
