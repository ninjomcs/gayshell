import { type Command } from "./command.ts";
import { makeDirectory } from "../filesystem.ts";

export const mkdir: Command = {
    name: "mkdir",
    executor: (args, workingDirectory) => {
        if (args.length > 0 ) {
            makeDirectory(workingDirectory, args[0]);
        }
        return [];
    },
    keepLines: true,
    usage: "mkdir"
};