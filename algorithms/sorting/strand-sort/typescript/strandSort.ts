function mergeSorted(a: number[], b: number[]): number[] {
    const result: number[] = [];
    let i = 0, j = 0;
    while (i < a.length && j < b.length) {
        if (a[i] <= b[j]) result.push(a[i++]);
        else result.push(b[j++]);
    }
    while (i < a.length) result.push(a[i++]);
    while (j < b.length) result.push(b[j++]);
    return result;
}

export function strandSort(arr: number[]): number[] {
    if (arr.length <= 1) return [...arr];

    const remaining = [...arr];
    let output: number[] = [];

    while (remaining.length > 0) {
        const strand: number[] = [remaining.shift()!];

        let i = 0;
        while (i < remaining.length) {
            if (remaining[i] >= strand[strand.length - 1]) {
                strand.push(remaining.splice(i, 1)[0]);
            } else {
                i++;
            }
        }

        output = mergeSorted(output, strand);
    }

    return output;
}
