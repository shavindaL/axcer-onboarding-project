import { APIGatewayProxyHandler } from "aws-lambda";

export const main: APIGatewayProxyHandler = async (event) => {

    console.log("New connection");
    console.log("Connection id----------------", event.requestContext.connectionId);

    return {
        statusCode: 200,
        body: "Connected",
    };
}
