import { type Command, type ExecOutput } from "./command.ts";
import { findNode } from "../filesystem.ts";
import type { ReactNode } from "react";

export const ls: Command = {
    name: "ls",
    executor: (args, workingDirectory): ExecOutput => {
        const dirstyle = "text-pink-200 font-bold";
        let stdout: (string | ReactNode)[];

        if (args.length > 0) {
            const node = findNode(workingDirectory, args[0]);
            if (!node) {
                stdout = [`ls: cannot access '${args[0]}': No such file or directory`];
            } else if (!node.subdirectories) {
                stdout = [node.name];
            } else {
                stdout = node.subdirectories.sort().map(node =>
                    node.subdirectories ? <span className={dirstyle}>{node.name}</span> : node.name
                );
            }
        } else {
            stdout = workingDirectory.subdirectories?.sort().map(node =>
                node.subdirectories ? <span className={dirstyle}>{node.name}</span> : node.name
            ) ?? [""];
        }

        return { stdout };
    },
    keepLines: true,
    usage: "ls"
};
