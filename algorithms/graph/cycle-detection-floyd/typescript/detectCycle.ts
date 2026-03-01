export function detectCycle(arr: number[]): number {
    const n = arr.length;
    if (n === 0) {
        return -1;
    }

    function nextPos(pos: number): number {
        if (pos < 0 || pos >= n || arr[pos] === -1) {
            return -1;
        }
        return arr[pos];
    }

    let tortoise = 0;
    let hare = 0;

    // Phase 1: Detect cycle
    while (true) {
        tortoise = nextPos(tortoise);
        if (tortoise === -1) return -1;

        hare = nextPos(hare);
        if (hare === -1) return -1;
        hare = nextPos(hare);
        if (hare === -1) return -1;

        if (tortoise === hare) break;
    }

    // Phase 2: Find cycle start
    let pointer1 = 0;
    let pointer2 = tortoise;
    while (pointer1 !== pointer2) {
        pointer1 = arr[pointer1];
        pointer2 = arr[pointer2];
    }

    return pointer1;
}
