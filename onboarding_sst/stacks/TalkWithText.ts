import { StackContext, WebSocketApi } from "sst/constructs";

export function TalkWithText({ stack }: StackContext) {
  console.log('New User Connection');

  const socket = new WebSocketApi(stack, "Api",
    {
      defaults: {
        function:{
          environment:{
            OPENAI_API_KEY: "",
          }
        }
      },
      routes: {
        $connect: "packages/functions/src/connect.main",
        $disconnect: "packages/functions/src/disconnect.main",
        sendmessage: "packages/functions/src/main.main",
      }
    }
  );

  stack.addOutputs({
    ApiEndPoint: socket.url,
  });
}
