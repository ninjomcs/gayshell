import { type Command, type ExecOutput } from "./command.ts";
import { makeDirectory } from "../filesystem.ts";

export const mkdir: Command = {
    name: "mkdir",
    executor: (args, workingDirectory): ExecOutput => {
        if (args.length > 0) makeDirectory(workingDirectory, args[0]);
        return { stdout: [] };
    },
    keepLines: true,
    usage: "mkdir"
};
