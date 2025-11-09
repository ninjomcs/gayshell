import { type Command, type ExecOutput } from "./command.ts";

export const whoami: Command = {
    name: "whoami",
    executor: (): ExecOutput => {
        return { stdout: [navigator.userAgent] };
    },
    keepLines: true,
    usage: "whoami"
};
