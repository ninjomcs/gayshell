import { type Command } from "./command.ts";

export const whoami: Command = {
    name: "whoami",
    executor: () => [navigator.userAgent],
    keepLines: true,
    usage: "whoami"
};