import type { Command, ExecOutput } from "./command.ts";

export const clear: Command = {
    name: "clear",
    executor: (): ExecOutput => ({ stdout: [] }),
    keepLines: false,
    usage: "clear"
};