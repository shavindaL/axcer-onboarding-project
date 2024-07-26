import { SSTConfig } from "sst";
import { TalkWithText } from "./stacks/TalkWithText";

export default {
    config(_input) {
        return {
            name: "talking-text-ws",
            region: "us-east-1",
        };
    },
    stacks(ws) {
        ws.stack(TalkWithText)
    },
} satisfies SSTConfig;
