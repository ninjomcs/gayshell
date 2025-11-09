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
import { executeWasm } from "../executable.ts";
import { fupload } from "./fupload.ts";

export type Command = {
    name: string;
    executor: (args: string[], workingDirectory: FileSystemNode) => ExecOutput;
    keepLines: boolean;
    usage: string;
}

export type ExecOutput = {
    stdout: (string | ReactNode)[];
    newWorkingDirectory?: FileSystemNode;
    requestFile?: boolean;
};

export const commands = [help, clear, echo, cv, scegg, ls, cd, mkdir, touch, whoami, cat, fupload];

export const execute = async (
    name: string,
    currentLines: (string | ReactNode)[],
    workingDirectory: FileSystemNode,
    rawArgs: string[]
): Promise<ExecOutput> => {

    if (/^\s*$/.test(name)) {
        return { stdout: [...currentLines], newWorkingDirectory: workingDirectory };
    }

    const args = rawArgs.map(arg =>
        arg.startsWith('"') && arg.endsWith('"')
            ? arg.slice(1, -1)
            : arg
    );

    if (name.startsWith("./")) {
        const dotslash = name.split("./");

        if (dotslash.length <= 1 || (dotslash.length > 1 && dotslash[1] == "")) {
            return { stdout: [...currentLines, `gayshell: ${name}: Is a directory`], newWorkingDirectory: workingDirectory };
        }

        const program = findNode(workingDirectory, dotslash[1]);

        if (program && program.binary) {
            const output = await executeWasm(program.binary);
            return { stdout: [...currentLines, output] };
        }

        return { stdout: [...currentLines, `gayshell: ${name}: Not an executable`] };
    }

    const searchCommand = commands.filter(cmd => cmd.name == name);
    if (searchCommand.length === 0) {
        return { stdout: [...currentLines, `gayshell: ${name}: command not found...`] };
    }

    const redirect = args.indexOf(">");
    const append = args.indexOf(">>");


    if (redirect >= 0) {
        if (args.length <= redirect + 1) {
            return { stdout: ["gayshell: syntax error: nowhere to redirect"] };
        }

        const { stdout } = searchCommand[0].executor(args.slice(0, redirect), workingDirectory);
        createFile(workingDirectory, args[redirect + 1], [...stdout]);

        return { stdout: [...currentLines] };
    }

    if (append >= 0) {
        if (args.length <= append + 1) {
            return { stdout: ["gayshell: syntax error: nowhere to redirect"] };
        }

        const node = findNode(workingDirectory, args[append + 1]);
        const { stdout } = searchCommand[0].executor(args.slice(0, append), workingDirectory);

        if (!node || node.subdirectories) {
            createFile(workingDirectory, args[append + 1], [...stdout]);
        } else {
            if (node.content) {
                node.content = [...node.content, ...stdout];
            }
        }

        return { stdout: [...currentLines] };
    }

    const result = searchCommand[0].executor(args, workingDirectory);

    if (searchCommand[0].keepLines) {
        return { stdout: [...currentLines, ...result.stdout], newWorkingDirectory: result.newWorkingDirectory, requestFile: result.requestFile };
    }

    return result;
};