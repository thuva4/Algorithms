function inorderHelper(arr: number[], i: number, result: number[]): void {
    if (i >= arr.length || arr[i] === -1) return;
    inorderHelper(arr, 2 * i + 1, result);
    result.push(arr[i]);
    inorderHelper(arr, 2 * i + 2, result);
}

export function treeTraversals(arr: number[]): number[] {
    const result: number[] = [];
    inorderHelper(arr, 0, result);
    return result;
}
