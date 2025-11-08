import { type Command } from "./command.ts";

export const cv: Command = {
    name: "cv",
    executor: () => [
        <>&gt; <span className="font-bold text-pink-200">♥ Education</span></>,
        "",
        <>&gt;&gt; <span className="text-purple-200">University of Oslo</span></>,
        ">> BSc Informatics: Programming and Systems Architecture",
        <>&gt;&gt; 2023-08 --&gt; <span className="font-bold">current</span> </>,
        "------------------------------------------",
        "",
        <>&gt; <span className="font-bold text-pink-200">♥ Work</span></>,
        "",
        <>&gt;&gt; <span className="text-purple-200">University of Oslo [IT department]</span></>,
        ">> Consultant",
        <>&gt;&gt; 2025-08 --&gt; <span className="font-bold">current</span> </>,
        ">> First-line IT support for employees and students at UiO",
        "------------------------------------------"
    ],
    keepLines: true,
    usage: "cv"
}