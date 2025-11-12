import { createWasiImports } from "./executable.ts";

self.onmessage = async (e) => {
    const wasmExecutable = e.data;
    const instanceRef = {instance: undefined as WebAssembly.Instance | undefined};

    const imports = createWasiImports(instanceRef, {
        onStdout: (data) => self.postMessage({ type: "stdout", data })
    });

    const wasm = await WebAssembly.instantiateStreaming(new Response(wasmExecutable), imports);
    instanceRef.instance = wasm.instance;
    const main = instanceRef.instance.exports._start as () => void;

    if (main) {
        main();
    }
}
