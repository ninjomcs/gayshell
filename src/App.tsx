import './App.css'
import { type ReactNode, useEffect, useRef, useState } from "react";
import { execute } from "./commands/command.ts";

function App() {
    const [lines, setLines] = useState<(string|ReactNode)[]>([]);
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [cursor, setCursor] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const prompt = "[user@ninjo.gay ~]$";

    useEffect(() => {
        if (textRef.current) {
            textRef.current.scrollIntoView({block: "end"});
        }
    }, [lines])

    return (
        <main ref={textRef}
              className="w-screen min-h-screen bg-gray-900 jetbrains-mono-term relative flex flex-col-reverse overflow-auto">
            <div className="grow">
                {lines.map(line => <div className="min-h-5 wrap-break-word">{line}</div>)}
                <div className="flex gap-[1ch]">
                    <span>{prompt}</span>
                    <input type="text" autoFocus ref={inputRef} className="grow focus:outline-none" value={cursor}
                           onChange={(e) => setCursor(e.target.value)}
                           onBlur={() => {
                               if (inputRef.current) {
                                   inputRef.current.focus();
                               }
                           }}
                           onKeyDown={(e) => {
                               if (e.key === "Enter") {
                                   const command = cursor.split(" ");
                                   setLines([...execute(command[0], [...lines, `${prompt} ${cursor}`], command.slice(1))])
                                   setHistory([...history, cursor])
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
        </main>
    )
}

export default App
