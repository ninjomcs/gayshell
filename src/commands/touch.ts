import { type Command } from "./command.ts";
import { createFile } from "../filesystem.ts";

export const touch: Command = {
    name: "touch",
    executor: (args, workingDirectory) => {
        if (args.length > 0 ) {
            createFile(workingDirectory, args[0], "");
        }
        return [];
    },
    keepLines: true,
    usage: "touch"
};