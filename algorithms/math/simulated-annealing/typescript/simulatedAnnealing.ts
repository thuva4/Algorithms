export function simulatedAnnealing(arr: number[]): number {
    if (arr.length === 0) return 0;
    if (arr.length === 1) return arr[0];

    const n = arr.length;

    // Simple seeded PRNG
    let seed = 42;
    function nextRand(): number {
        seed = (seed * 1103515245 + 12345) & 0x7fffffff;
        return seed / 0x7fffffff;
    }
    function nextInt(max: number): number {
        return Math.floor(nextRand() * max);
    }

    let current = 0;
    let best = 0;
    let temperature = 1000.0;
    const coolingRate = 0.995;
    const minTemp = 0.01;

    while (temperature > minTemp) {
        const neighbor = nextInt(n);
        const delta = arr[neighbor] - arr[current];

        if (delta < 0) {
            current = neighbor;
        } else {
            const probability = Math.exp(-delta / temperature);
            if (nextRand() < probability) {
                current = neighbor;
            }
        }

        if (arr[current] < arr[best]) {
            best = current;
        }

        temperature *= coolingRate;
    }

    return arr[best];
}
