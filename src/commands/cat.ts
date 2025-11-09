import { type Command, type ExecOutput } from "./command.ts";
import { findNode } from "../filesystem.ts";

export const cat: Command = {
    name: "cat",
    executor: (args, workingDirectory): ExecOutput => {
        if (args.length > 0) {
            const node = findNode(workingDirectory, args[0]);
            if (!node) {
                return { stdout: [`cat: ${args[0]}: No such file or directory`] };
            }
            if (node.subdirectories !== undefined) {
                return { stdout: [`cat: ${args[0]}: Is a directory`] };
            }
            return { stdout: node.content ?? [] };
        }
        return { stdout: [] };
    },
    keepLines: true,
    usage: "cat"
};
