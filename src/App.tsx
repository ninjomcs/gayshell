import './App.css'
import { type ReactNode, useEffect, useRef, useState } from "react";
import { execute } from "./commands/command.ts";
import { createFile, type FileSystemNode, initial, pathFromStart } from "./filesystem.ts";

function App() {
    const [lines, setLines] = useState<(string | ReactNode)[]>([]);
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [cursor, setCursor] = useState("");
    const [workingDirectory, setWorkingDirectory] = useState<FileSystemNode>(initial);
    const inputRef = useRef<HTMLInputElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const prompt = `[${navigator.userAgent.split(" ")[0] ?? "user"}@ninjo.gay ~${pathFromStart(workingDirectory)}]$`;

    useEffect(() => {
        if (textRef.current) {
            textRef.current.scrollIntoView({block: "end"});
        }
    }, [lines]);

    useEffect(() => {
        document.title = prompt;
    }, [prompt]);

    return (
        <main ref={textRef}
              className="w-screen min-h-dvh bg-gray-900 jetbrains-mono-term relative flex flex-col overflow-y-auto overflow-x-hidden">
            <div className="grow pr-2 wrap-break-word">
                {lines.map(line => <div className="min-h-5 wrap-break-word whitespace-pre-wrap">{line}</div>)}
                <div className="flex flex-wrap gap-x-[1ch] min-w-0">
                    <span>{prompt}</span>
                    <input type="text" autoFocus ref={inputRef} className="focus:outline-none min-w-0 flex-1"
                           value={cursor}
                           onChange={(e) => setCursor(e.target.value)}
                           onBlur={() => {
                               if (inputRef.current) {
                                   inputRef.current.focus();
                               }
                           }}
                           onKeyDown={async (e) => {
                               if (e.key === "Enter") {
                                   let newLines = [...lines, `${prompt} ${cursor}`];
                                   let currentWD = workingDirectory;

                                   for (const cmd of cursor.split("&&")) {
                                       const command = cmd.match(/(?:[^\s"]+|"[^"]*")+/g) ?? [""];

                                       const { stdout, newWorkingDirectory, requestFile } = await execute(
                                           command[0],
                                           newLines,
                                           currentWD,
                                           command.slice(1)
                                       );

                                       if (requestFile) fileInputRef.current?.click();

                                       newLines = [...stdout];
                                       currentWD = newWorkingDirectory ?? currentWD;
                                   }

                                   setLines(newLines);
                                   setWorkingDirectory(currentWD);

                                   setHistory([...history, cursor]);
                                   setHistoryIndex(0);
                                   setCursor("");
                               }
                               if (e.key === "ArrowUp") {
                                   if (history.length > historyIndex) {
                                       setHistoryIndex(historyIndex + 1);
                                       setCursor(history[history.length - historyIndex - 1]);
                                   } else {
                                       setCursor(history[history.length - historyIndex - 1])
                                   }
                                   console.log(historyIndex)
                               }
                               if (e.key === "ArrowDown") {
                                   if (historyIndex > 0) {
                                       setHistoryIndex(historyIndex - 1);
                                       setCursor(history[history.length - (historyIndex - 1) - 1]);
                                   } else {
                                       setCursor("");
                                   }
                               }
                           }}/>
                </div>
            </div>
            <input type="file" id="upload" className="hidden" ref={fileInputRef} onChange={(e) => {
                if (e.target.files?.[0]) {
                    const file = e.target.files[0];
                    file.arrayBuffer().then(buffer => {
                        createFile(workingDirectory, file.name, [], new Blob([buffer], { type: file.name.endsWith(".wasm") ? "application/wasm" : undefined }));
                    });
                }
            }}/>
        </main>
    )
}

export default App
