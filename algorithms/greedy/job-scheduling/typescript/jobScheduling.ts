export function jobScheduling(arr: number[]): number {
    const n = arr[0];
    const jobs: [number, number][] = [];
    let maxDeadline = 0;

    for (let i = 0; i < n; i++) {
        const deadline = arr[1 + 2 * i];
        const profit = arr[1 + 2 * i + 1];
        jobs.push([deadline, profit]);
        maxDeadline = Math.max(maxDeadline, deadline);
    }

    jobs.sort((a, b) => b[1] - a[1]);

    const slots = new Array(maxDeadline + 1).fill(false);
    let totalProfit = 0;

    for (const [deadline, profit] of jobs) {
        for (let t = Math.min(deadline, maxDeadline); t > 0; t--) {
            if (!slots[t]) {
                slots[t] = true;
                totalProfit += profit;
                break;
            }
        }
    }

    return totalProfit;
}
