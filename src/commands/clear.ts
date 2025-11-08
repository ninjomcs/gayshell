import type { Command } from "./command.ts";

export const clear: Command = {
    name: "clear",
    executor: () => [],
    keepLines: false,
    usage: "clear"
};