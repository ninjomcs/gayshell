import { type Command, type ExecOutput } from "./command.ts";
import { createFile } from "../filesystem.ts";

export const touch: Command = {
    name: "touch",
    executor: (args, workingDirectory): ExecOutput => {
        if (args.length > 0) createFile(workingDirectory, args[0], []);
        return { stdout: [] };
    },
    keepLines: true,
    usage: "touch"
};
