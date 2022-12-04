import { AWS } from "@package/aws-sdk-with-xray";

let options = {};
if (process.env.NODE_ENV === "test") {
  options = {
    endpoint: process.env.MOCK_DYNAMODB_ENDPOINT,
    sslEnabled: false,
    region: "local",
  };
} else if (process.env.IS_OFFLINE) {
  options = {
    endpoint: "http://localhost:8000",
    region: "local",
  };
}

export const dynamoDbClient: AWS.DynamoDB.DocumentClient = new AWS.DynamoDB.DocumentClient(options);
