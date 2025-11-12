import { help } from "./help.ts";
import { clear } from "./clear.ts";
import { echo } from "./echo.ts";
import { cv } from "./cv.tsx";
import type { ReactNode } from "react";
import { scegg } from "./scegg.tsx";
import { createFile, type FileSystemNode, findNode } from "../filesystem.ts";
import { ls } from "./ls.tsx";
import { cd } from "./cd.ts";
import { mkdir } from "./mkdir.ts";
import { touch } from "./touch.ts";
import { whoami } from "./whoami.ts";
import { cat } from "./cat.ts";
import { executeWasm } from "../executable/executable.ts";
import { fupload } from "./fupload.ts";

export type Command = {
    name: string;
    executor: (args: string[], workingDirectory: FileSystemNode) => ExecOutput;
    keepLines: boolean;
    usage: string;
}

export type ExecOutput = {
    newWorkingDirectory?: FileSystemNode;
    requestFile?: boolean;
    stdout?: (string | ReactNode)[];
    worker?: Worker;
};

export const commands = [help, clear, echo, cv, scegg, ls, cd, mkdir, touch, whoami, cat, fupload];

export const execute = async (
    name: string,
    workingDirectory: FileSystemNode,
    rawArgs: string[],
    onStdout: (line: string | ReactNode) => void
): Promise<ExecOutput> => {

    if (/^\s*$/.test(name)) {
        return { newWorkingDirectory: workingDirectory };
    }

    const args = rawArgs.map(arg =>
        arg.startsWith('"') && arg.endsWith('"')
            ? arg.slice(1, -1)
            : arg
    );

    if (name.startsWith("./")) {
        const dotslash = name.split("./");

        if (dotslash.length <= 1 || (dotslash.length > 1 && dotslash[1] === "")) {
            onStdout(`gayshell: ${name}: Is a directory`);
            return { newWorkingDirectory: workingDirectory };
        }

        const program = findNode(workingDirectory, dotslash[1]);

        if (program && program.binary) {
            const worker = executeWasm(program.binary, onStdout);
            return { newWorkingDirectory: workingDirectory, worker };
        }

        onStdout(`gayshell: ${name}: Not an executable`);
        return { newWorkingDirectory: workingDirectory };
    }

    const searchCommand = commands.find(cmd => cmd.name === name);
    if (!searchCommand) {
        onStdout(`gayshell: ${name}: command not found...`);
        return { newWorkingDirectory: workingDirectory };
    }

    const redirect = args.indexOf(">");
    const append = args.indexOf(">>");

    if (redirect >= 0) {
        if (args.length <= redirect + 1) {
            onStdout("gayshell: syntax error: nowhere to redirect");
            return { newWorkingDirectory: workingDirectory };
        }

        const { stdout } = searchCommand.executor(args.slice(0, redirect), workingDirectory);
        createFile(workingDirectory, args[redirect + 1], stdout ?? []);
        return { newWorkingDirectory: workingDirectory };
    }

    if (append >= 0) {
        if (args.length <= append + 1) {
            onStdout("gayshell: syntax error: nowhere to redirect");
            return { newWorkingDirectory: workingDirectory };
        }

        const node = findNode(workingDirectory, args[append + 1]);
        const { stdout } = searchCommand.executor(args.slice(0, append), workingDirectory);

        if (!node || node.subdirectories) {
            createFile(workingDirectory, args[append + 1], stdout ?? []);
        } else {
            node.content = node.content ? [...node.content, ...stdout ?? []] : stdout;
        }

        return { newWorkingDirectory: workingDirectory };
    }

    const result = searchCommand.executor(args, workingDirectory);

    if (result.stdout && result.stdout.length > 0) {
        for (const line of result.stdout) {
            onStdout(line);
        }
    }

    return result;
};