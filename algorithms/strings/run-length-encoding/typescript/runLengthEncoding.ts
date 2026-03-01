export function runLengthEncoding(arr: number[]): number[] {
    if (arr.length === 0) return [];
    const result: number[] = [];
    let count = 1;
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] === arr[i - 1]) { count++; }
        else { result.push(arr[i - 1], count); count = 1; }
    }
    result.push(arr[arr.length - 1], count);
    return result;
}
