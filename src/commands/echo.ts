import type { Command, ExecOutput } from "./command.ts";

export const echo: Command = {
    name: "echo",
    executor: (args): ExecOutput => {
        return {
            stdout: args.length === 0 ? [" "] : [args.join(" ")]
        };
    },
    keepLines: true,
    usage: "echo [-neE] [arg ...]"
};
