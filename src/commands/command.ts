import { help } from "./help.ts";
import { clear } from "./clear.ts";
import { echo } from "./echo.ts";
import { cv } from "./cv.tsx";
import type { ReactNode } from "react";
import { scegg } from "./scegg.tsx";
import type { FileSystemNode } from "../filesystem.ts";
import { ls } from "./ls.ts";
import { cd } from "./cd.ts";
import { mkdir } from "./mkdir.ts";
import { touch } from "./touch.ts";
import { whoami } from "./whoami.ts";

export type Command = {
    name: string;
    executor: (args: string[], workingDirectory: FileSystemNode, setWorkingDirectory: (dir: FileSystemNode) => void) => (string | ReactNode)[];
    keepLines: boolean;
    usage: string;
}


export const commands = [help, clear, echo, cv, scegg, ls, cd, mkdir, touch, whoami];

export const execute = (name: string, currentLines: (string | React.ReactNode | `[user@ninjo.gay ~]$ ${string}`)[], workingDirectory: FileSystemNode, setWorkingDirectory: (dir: FileSystemNode) => void, args: string[]): (string | React.ReactNode)[] => {
    if (/^\s*$/.test(name)) {
        return [...currentLines];
    }

    const searchCommand = commands.filter(cmd => cmd.name == name);
    if (searchCommand.length === 0) {
        return [...currentLines, `gayshell: ${name}: command not found...`]
    }

    if (searchCommand[0].keepLines) {
        console.log([...currentLines, ...searchCommand[0].executor(args, workingDirectory, setWorkingDirectory)])
        return [...currentLines, ...searchCommand[0].executor(args, workingDirectory, setWorkingDirectory)];
    }

    return [...searchCommand[0].executor(args, workingDirectory, setWorkingDirectory)];
};