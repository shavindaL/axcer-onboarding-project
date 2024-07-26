import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    console.log("Disconnected----------");
    console.log("Connection id----------------", event.requestContext.connectionId);

    return {
        statusCode: 200,
        body: "Disconnected",
    };
}