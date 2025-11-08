import { type Command } from "./command.ts";
import { findNode } from "../filesystem.ts";

export const ls: Command = {
    name: "ls",
    executor: (args, workingDirectory) => {
        if (args.length > 0) {
            const node = findNode(workingDirectory, args[0]);
            if (!node) {
                return [`ls: cannot access '${args[0]}': No such file or directory`];
            }
            if (!node.subdirectories) {
                return [node.name];
            }
            return node.subdirectories.map(node => node.name);
        }
        return workingDirectory.subdirectories?.map(node => node.name) ?? [""];
    },
    keepLines: true,
    usage: "ls"
};