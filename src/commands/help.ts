import { type Command, type ExecOutput, commands } from "./command.ts";

export const help: Command = {
    name: "help",
    executor: (): ExecOutput => {
        return {
            stdout: [
                "gayshell, version 0.0.1",
                "These shell commands are defined internally. Type `help' to see this list.",
                "Type `help name' to find out more about the function `name'.",
                "Use `man -k' or `info' to find out more about commands not in this list.",
                "",
                "A star (*) next to a name means that the command is disabled.",
                "",
                ...commands.map(cmd => "> ♥ ︎" + cmd.usage)
            ]
        };
    },
    keepLines: true,
    usage: "help"
};
