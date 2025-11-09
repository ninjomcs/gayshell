import { type Command, type ExecOutput } from "./command.ts";

export const fupload: Command = {
    name: "fupload",
    executor: (): ExecOutput => ({ stdout: [], requestFile: true }),
    keepLines: true,
    usage: "fupload"
};