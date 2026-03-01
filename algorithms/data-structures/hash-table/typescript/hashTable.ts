class HashTableImpl {
    private size: number;
    private buckets: Array<Array<[number, number]>>;

    constructor(size: number = 64) {
        this.size = size;
        this.buckets = Array.from({ length: size }, () => []);
    }

    private hash(key: number): number {
        return Math.abs(key) % this.size;
    }

    put(key: number, value: number): void {
        const idx = this.hash(key);
        const bucket = this.buckets[idx];
        for (let i = 0; i < bucket.length; i++) {
            if (bucket[i][0] === key) {
                bucket[i][1] = value;
                return;
            }
        }
        bucket.push([key, value]);
    }

    get(key: number): number {
        const idx = this.hash(key);
        for (const [k, v] of this.buckets[idx]) {
            if (k === key) {
                return v;
            }
        }
        return -1;
    }

    delete(key: number): void {
        const idx = this.hash(key);
        const bucket = this.buckets[idx];
        for (let i = 0; i < bucket.length; i++) {
            if (bucket[i][0] === key) {
                bucket.splice(i, 1);
                return;
            }
        }
    }
}

export function hashTableOps(operations: number[]): number {
    const table = new HashTableImpl();
    const opCount = operations[0];
    let resultSum = 0;
    let idx = 1;

    for (let i = 0; i < opCount; i++) {
        const opType = operations[idx];
        const key = operations[idx + 1];
        const value = operations[idx + 2];
        idx += 3;

        if (opType === 1) {
            table.put(key, value);
        } else if (opType === 2) {
            resultSum += table.get(key);
        } else if (opType === 3) {
            table.delete(key);
        }
    }

    return resultSum;
}
