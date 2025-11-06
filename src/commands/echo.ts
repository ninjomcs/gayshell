import type { Command } from "./command.ts";

export const echo: Command = {
    name: "echo",
    executor: (args) => args.length === 0 ? [" "] : [args.join(" ")],
    keepLines: true,
    usage: "echo [-neE] [arg ...]"
}