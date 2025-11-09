import  { type ReactNode } from "react";

export type FileSystemNode = {
    name: string;
    subdirectories?: FileSystemNode[];
    content?: (string | ReactNode)[];
    parent?: FileSystemNode;
    binary?: Blob;
}

export const initial: FileSystemNode = {
    name: "",
    subdirectories: [],
}

export const makeDirectory = (workingDirectory: FileSystemNode, name: string): FileSystemNode | undefined => {
    if (workingDirectory.subdirectories?.find(node => node.name === name) !== undefined) return;
    const newDirectory: FileSystemNode = {
        name,
        subdirectories: [],
        parent: workingDirectory
    };
    workingDirectory.subdirectories?.push(newDirectory);
    return newDirectory;
}

export const createFile = (workingDirectory: FileSystemNode, name: string, content: (string | ReactNode)[], binary: Blob | undefined = undefined): FileSystemNode | undefined => {
    workingDirectory.subdirectories = workingDirectory.subdirectories?.filter(node => node.name !== name);
    const file: FileSystemNode = {
        name,
        content,
        parent: workingDirectory,
        binary
    };
    workingDirectory.subdirectories?.push(file);
    return file;
}

export const pathFromStart = (node: FileSystemNode): string => {
    const rec = (node: FileSystemNode | undefined, builtPath: string[]): string[] => {
        if (!node) return builtPath;
        return rec(node.parent, [...builtPath, node.name]);
    }
    return rec(node, []).reverse().join("/");
}

export const findNode = (start: FileSystemNode, path: string): FileSystemNode | undefined => {
    if (!path.trim()) return start;

    return path.split("/").reduce<FileSystemNode | undefined>(
        (curr, segment) => curr?.subdirectories?.find(node => node.name === segment),
        start
    );
}
