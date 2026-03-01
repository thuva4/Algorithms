function isSorted(arr: number[]): boolean {
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] > arr[i + 1]) {
            return false;
        }
    }
    return true;
}

function shuffle(arr: number[]): void {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

/**
 * Bogo Sort implementation.
 * Repeatedly shuffles the array until it's sorted.
 * WARNING: Highly inefficient for large arrays.
 */
export function bogoSort(arr: number[]): number[] {
    const result = [...arr];
    while (!isSorted(result)) {
        shuffle(result);
    }
    return result;
}
