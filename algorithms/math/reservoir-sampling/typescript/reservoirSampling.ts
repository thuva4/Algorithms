export function reservoirSampling(stream: number[], k: number, seed: number): number[] {
    const n = stream.length;

    if (k >= n) {
        return [...stream];
    }

    const reservoir = stream.slice(0, k);

    // Simple seeded PRNG (linear congruential generator)
    let state = seed;
    function nextRand(max: number): number {
        state = (state * 1103515245 + 12345) & 0x7fffffff;
        return state % max;
    }

    for (let i = k; i < n; i++) {
        const j = nextRand(i + 1);
        if (j < k) {
            reservoir[j] = stream[i];
        }
    }

    return reservoir;
}
