export function fractionalKnapsack(arr: number[]): number {
    const capacity = arr[0];
    const n = arr[1];
    const items: [number, number][] = [];
    let idx = 2;
    for (let i = 0; i < n; i++) {
        items.push([arr[idx], arr[idx + 1]]);
        idx += 2;
    }

    items.sort((a, b) => b[0] / b[1] - a[0] / a[1]);

    let totalValue = 0;
    let remaining = capacity;

    for (const [value, weight] of items) {
        if (remaining <= 0) break;
        if (weight <= remaining) {
            totalValue += value;
            remaining -= weight;
        } else {
            totalValue += value * remaining / weight;
            remaining = 0;
        }
    }

    return Math.floor(totalValue * 100);
}
