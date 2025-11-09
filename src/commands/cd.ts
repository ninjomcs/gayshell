import { type Command, type ExecOutput } from "./command.ts";
import { findNode } from "../filesystem.ts";

export const cd: Command = {
    name: "cd",
    executor: (args, workingDirectory): ExecOutput => {
        if (args.length > 0) {
            if (args[0] === "..") {
                return { stdout: [], newWorkingDirectory: workingDirectory.parent };
            }
            const node = findNode(workingDirectory, args[0]);
            if (!node) {
                return { stdout: [`gayshell: cd: ${args[0]}: No such file or directory`] };
            }
            if (!node.subdirectories) {
                return { stdout: [`gayshell: cd: ${args[0]}: Not a directory`] };
            }
            return { stdout: [], newWorkingDirectory: node }
        } else {
            if (workingDirectory.parent) return { stdout: [], newWorkingDirectory: workingDirectory.parent };
        }
        return { stdout: [] };
    },
    keepLines: true,
    usage: "cd"
};
