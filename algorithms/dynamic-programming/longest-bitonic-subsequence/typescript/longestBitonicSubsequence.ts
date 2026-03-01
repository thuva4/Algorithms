export function longestBitonicSubsequence(arr: number[]): number {
    const n = arr.length;
    if (n === 0) return 0;

    const lis: number[] = new Array(n).fill(1);
    const lds: number[] = new Array(n).fill(1);

    for (let i = 1; i < n; i++) {
        for (let j = 0; j < i; j++) {
            if (arr[j] < arr[i] && lis[j] + 1 > lis[i]) {
                lis[i] = lis[j] + 1;
            }
        }
    }

    for (let i = n - 2; i >= 0; i--) {
        for (let j = n - 1; j > i; j--) {
            if (arr[j] < arr[i] && lds[j] + 1 > lds[i]) {
                lds[i] = lds[j] + 1;
            }
        }
    }

    let result = 0;
    for (let i = 0; i < n; i++) {
        result = Math.max(result, lis[i] + lds[i] - 1);
    }

    return result;
}

console.log(longestBitonicSubsequence([1, 3, 4, 2, 6, 1])); // 5
