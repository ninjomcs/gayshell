import { help } from "./help.ts";
import { clear } from "./clear.ts";
import { echo } from "./echo.ts";
import { cv } from "./cv.tsx";
import type { ReactNode } from "react";
import { scegg } from "./scegg.tsx";

export type Command = {
    name: string;
    executor: (args: string[]) => (string | ReactNode)[];
    keepLines: boolean;
    usage: string;
}


export const commands = [help, clear, echo, cv, scegg];

export const execute = (name: string, currentLines: (string | React.ReactNode | `[user@ninjo.gay ~]$ ${string}`)[], args: string[]): (string | React.ReactNode)[] => {
    if (/^\s*$/.test(name)) {
        return [...currentLines];
    }

    const searchCommand = commands.filter(cmd => cmd.name == name);
    if (searchCommand.length === 0) {
        return [...currentLines, `gayshell: ${name}: command not found...`]
    }

    if (searchCommand[0].keepLines) {
        console.log([...currentLines, ...searchCommand[0].executor(args)])
        return [...currentLines, ...searchCommand[0].executor(args)];
    }

    return [...searchCommand[0].executor(args)];
}