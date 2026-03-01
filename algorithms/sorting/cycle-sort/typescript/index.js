function cycleSort(arr) {
    const n = arr.length;

    for (let cycleStart = 0; cycleStart < n - 1; cycleStart++) {
        let item = arr[cycleStart];

        // Find the position where we put the item
        let pos = cycleStart;
        for (let i = cycleStart + 1; i < n; i++) {
            if (arr[i] < item) {
                pos++;
            }
        }

        // If the item is already in the correct position
        if (pos === cycleStart) {
            continue;
        }

        // Skip duplicates
        while (item === arr[pos]) {
            pos++;
        }

        // Put the item to its correct position
        if (pos !== cycleStart) {
            let temp = item;
            item = arr[pos];
            arr[pos] = temp;
        }

        // Rotate the rest of the cycle
        while (pos !== cycleStart) {
            pos = cycleStart;

            for (let i = cycleStart + 1; i < n; i++) {
                if (arr[i] < item) {
                    pos++;
                }
            }

            while (item === arr[pos]) {
                pos++;
            }

            if (item !== arr[pos]) {
                let temp = item;
                item = arr[pos];
                arr[pos] = temp;
            }
        }
    }

    return arr;
}

// Example usage
const arr = [5, 3, 8, 1, 2, -3, 0];
console.log(cycleSort(arr));

module.exports = cycleSort;
