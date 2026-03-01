export function subsetSum(arr: number[], target: number): number {
    function backtrack(index: number, remaining: number): boolean {
        if (remaining === 0) {
            return true;
        }
        if (index >= arr.length) {
            return false;
        }
        // Include arr[index]
        if (backtrack(index + 1, remaining - arr[index])) {
            return true;
        }
        // Exclude arr[index]
        if (backtrack(index + 1, remaining)) {
            return true;
        }
        return false;
    }

    return backtrack(0, target) ? 1 : 0;
}
