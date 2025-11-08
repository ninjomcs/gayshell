import { type Command } from "./command.ts";
import { findNode } from "../filesystem.ts";

export const cd: Command = {
    name: "cd",
    executor: (args, workingDirectory, setWorkingDirectory) => {
        if (args.length > 0) {
            if (args[0] == "..") {
                if (workingDirectory.parent) setWorkingDirectory(workingDirectory.parent);
                return [];
            }
            const node = findNode(workingDirectory, args[0]);
            if (!node) {
                return [`gayshell: cd: ${args[0]}: No such file or directory`];
            }
            if (!node.subdirectories) {
                return [`gayshell: cd: ${args[0]}: Not a directory`];
            }
            setWorkingDirectory(node);
        } else {
            if (workingDirectory.parent) setWorkingDirectory(workingDirectory.parent);
        }
        return [];
    },
    keepLines: true,
    usage: "cd"
}