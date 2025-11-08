import { expect, test,  } from "vitest";
import { createFile, type FileSystemNode, findNode, makeDirectory, pathFromStart } from "./filesystem.ts";

test("finds directory", () => {
    const testFileSystem: FileSystemNode = {
        name: "",
        subdirectories: [],
    }

    makeDirectory(testFileSystem, "dir");
    createFile(testFileSystem, "hi.txt", "hi");
    expect(findNode(testFileSystem, "dir")?.name).toBe("dir");
    expect(findNode(testFileSystem, "hi.txt")?.name).toBe("hi.txt");
});

test("creates path", () => {
    const testFileSystem: FileSystemNode = {
        name: "",
        subdirectories: [],
    }

    const dir = makeDirectory(testFileSystem, "dir");
    const hi = dir && createFile(dir, "hi.txt", "hi");
    expect(pathFromStart(hi ?? testFileSystem)).toBe("/dir/hi.txt");
})