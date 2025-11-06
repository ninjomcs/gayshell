import { type Command } from "./command.ts";

export const cv: Command = {
    name: "cv",
    executor: () => [
        "> ♥ Education",
        "",
        ">> Univerity of Oslo",
        ">> BSc Informatics: Programming and Systems Architecture",
        ">> 2023-06 --> current",
        "",
        "> ♥ Work",
        "",
        ">> Univerity of Oslo",
        ">> Consultant",
        ">> 2025-08 --> current"
    ],
    keepLines: true,
    usage: "cv"
}