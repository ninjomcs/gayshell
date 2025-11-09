export interface WasiImportsOptions {
    onStdout: (output: string) => void;
}

export const createWasiImports = (
    instanceRef: { instance?: WebAssembly.Instance },
    options: WasiImportsOptions
) => {
    return {
        wasi_snapshot_preview1: {
            environ_sizes_get(): number {
                return 0;
            },
            environ_get(): number {
                return 0;
            },
            proc_exit(): number {
                return 0;
            },

            fd_write(
                fd: number,
                iovsPtr: number,
                iovsLength: number,
                bytesWrittenPtr: number
            ): number {
                const instance = instanceRef.instance;
                if (!instance) throw new Error("WASM instance not assigned yet");

                const memory = instance.exports.memory as WebAssembly.Memory;
                const buffer = memory.buffer;

                if (fd !== 1) return 0; // Only handle stdout

                const iovs = new Uint32Array(buffer, iovsPtr, iovsLength * 2);
                const decoder = new TextDecoder();
                let output = "";
                let written = 0;

                for (let i = 0; i < iovsLength * 2; i += 2) {
                    const offset = iovs[i];
                    const length = iovs[i + 1];

                    const chunk = new Uint8Array(buffer, offset, length);
                    output += decoder.decode(chunk);
                    written += length;
                }

                new DataView(buffer).setUint32(bytesWrittenPtr, written, true);
                options.onStdout(output);

                return 0;
            }
        }
    };
}

export const executeWasm = async (wasmExecutable: Blob): Promise<string[]> => {
    const instanceRef = {instance: undefined as WebAssembly.Instance | undefined};

    const stdoutBuffer: string[] = [];

    const imports = createWasiImports(instanceRef, {
        onStdout(text) {
            stdoutBuffer.push(text);
        }
    });

    const wasm = await WebAssembly.instantiateStreaming(new Response(wasmExecutable), imports);
    instanceRef.instance = wasm.instance;

    (instanceRef.instance.exports._start as () => void)();

    return stdoutBuffer;
}
