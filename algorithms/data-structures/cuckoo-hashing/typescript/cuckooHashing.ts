export function cuckooHashing(data: number[]): number {
    const n = data[0];
    if (n === 0) return 0;

    const capacity = Math.max(2 * n, 11);
    const table1: (number | null)[] = new Array(capacity).fill(null);
    const table2: (number | null)[] = new Array(capacity).fill(null);
    const inserted = new Set<number>();

    const h1 = (key: number) => ((key % capacity) + capacity) % capacity;
    const h2 = (key: number) => (((Math.floor(key / capacity) + 1) % capacity) + capacity) % capacity;

    for (let i = 1; i <= n; i++) {
        const key = data[i];
        if (inserted.has(key)) continue;

        if (table1[h1(key)] === key || table2[h2(key)] === key) {
            inserted.add(key);
            continue;
        }

        let current = key;
        let success = false;
        for (let iter = 0; iter < 2 * capacity; iter++) {
            const pos1 = h1(current);
            if (table1[pos1] === null) {
                table1[pos1] = current;
                success = true;
                break;
            }
            const tmp1 = table1[pos1]!;
            table1[pos1] = current;
            current = tmp1;

            const pos2 = h2(current);
            if (table2[pos2] === null) {
                table2[pos2] = current;
                success = true;
                break;
            }
            const tmp2 = table2[pos2]!;
            table2[pos2] = current;
            current = tmp2;
        }
        if (success) inserted.add(key);
    }
    return inserted.size;
}

console.log(cuckooHashing([3, 10, 20, 30]));
console.log(cuckooHashing([4, 5, 5, 5, 5]));
console.log(cuckooHashing([5, 1, 2, 3, 4, 5]));
