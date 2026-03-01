/**
 * Cycle Sort implementation.
 * An in-place, unstable sorting algorithm that is optimal in terms of
 * the number of writes to the original array.
 * @param arr the input array
 * @returns a sorted copy of the array
 */
export function cycleSort(arr: number[]): number[] {
    const result = [...arr];
    const n = result.length;

    for (let cycleStart = 0; cycleStart <= n - 2; cycleStart++) {
        let item = result[cycleStart];

        let pos = cycleStart;
        for (let i = cycleStart + 1; i < n; i++) {
            if (result[i] < item) {
                pos++;
            }
        }

        if (pos === cycleStart) {
            continue;
        }

        while (item === result[pos]) {
            pos++;
        }

        if (pos !== cycleStart) {
            [result[pos], item] = [item, result[pos]];
        }

        while (pos !== cycleStart) {
            pos = cycleStart;
            for (let i = cycleStart + 1; i < n; i++) {
                if (result[i] < item) {
                    pos++;
                }
            }

            while (item === result[pos]) {
                pos++;
            }

            if (item !== result[pos]) {
                [result[pos], item] = [item, result[pos]];
            }
        }
    }

    return result;
}
