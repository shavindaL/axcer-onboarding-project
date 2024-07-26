import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { ChatClient } from "./aiChatClient";
import { ApiGatewayManagementApi } from "aws-sdk";

export const main: APIGatewayProxyHandler = async (event) => {

    console.log(event.body);
    const connectionId = event.requestContext.connectionId ?? '';
    const { domainName, stage } = event.requestContext;

    try {
        if (event.body === null) {
            throw new Error("No message found in the body");
        }

        if (event.body !== null) {
            const message = JSON.parse(event.body);
            console.log("Message received from client socket: ", message);

            const { transcript, selectedText } = message.data;

            const response = await ChatClient({ transcript, selectedText });

            const apiG = new ApiGatewayManagementApi({
                endpoint: `${domainName}/${stage}`
            });

            await apiG
                .postToConnection({ ConnectionId: connectionId, Data: JSON.stringify(response) })
                .promise();

            return {
                statusCode: 200,
                body: "Message sent",
            };
        } else {
            return {
                statusCode: 400,
                body: "Invalid request",
            };
        }


    } catch (error) {
        if (error instanceof Error) {
            console.log(`Error in serverless main function: ${error.message} \n ${error.stack}`);

        } else {
            console.log(`Error in serverless main function: ${error}`);
        }

        return {
            statusCode: 500,
            body: "Internal server error",
        };
    }


}