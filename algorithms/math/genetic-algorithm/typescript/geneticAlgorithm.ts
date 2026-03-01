export function geneticAlgorithm(arr: number[], seed: number): number {
    if (arr.length === 0) return 0;
    if (arr.length === 1) return arr[0];

    const n = arr.length;
    let state = seed;

    function nextRand(): number {
        state = (state * 1103515245 + 12345) & 0x7fffffff;
        return state / 0x7fffffff;
    }
    function nextInt(max: number): number {
        return Math.floor(nextRand() * max);
    }

    const popSize = Math.min(20, n);
    const generations = 100;
    const mutationRate = 0.1;

    let population: number[] = [];
    for (let i = 0; i < popSize; i++) {
        population.push(nextInt(n));
    }

    let bestIdx = population[0];
    for (const idx of population) {
        if (arr[idx] < arr[bestIdx]) bestIdx = idx;
    }

    for (let g = 0; g < generations; g++) {
        const newPop: number[] = [];
        for (let i = 0; i < popSize; i++) {
            const a = population[nextInt(popSize)];
            const b = population[nextInt(popSize)];
            newPop.push(arr[a] <= arr[b] ? a : b);
        }

        const offspring: number[] = new Array(popSize);
        for (let i = 0; i < popSize - 1; i += 2) {
            if (nextRand() < 0.7) {
                offspring[i] = newPop[i];
                offspring[i + 1] = newPop[i + 1];
            } else {
                offspring[i] = newPop[i + 1];
                offspring[i + 1] = newPop[i];
            }
        }
        if (popSize % 2 !== 0) {
            offspring[popSize - 1] = newPop[popSize - 1];
        }

        for (let i = 0; i < popSize; i++) {
            if (nextRand() < mutationRate) {
                offspring[i] = nextInt(n);
            }
        }

        population = offspring;

        for (const idx of population) {
            if (arr[idx] < arr[bestIdx]) bestIdx = idx;
        }
    }

    return arr[bestIdx];
}
