export function bitmaskDp(n: number, cost: number[][]): number {
    const total = 1 << n;
    const dp = new Array(total).fill(Infinity);
    dp[0] = 0;

    for (let mask = 0; mask < total; mask++) {
        if (dp[mask] === Infinity) continue;
        let worker = 0;
        let tmp = mask;
        while (tmp) { worker += tmp & 1; tmp >>= 1; }
        if (worker >= n) continue;
        for (let job = 0; job < n; job++) {
            if (!(mask & (1 << job))) {
                const newMask = mask | (1 << job);
                dp[newMask] = Math.min(dp[newMask], dp[mask] + cost[worker][job]);
            }
        }
    }

    return dp[total - 1];
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
const lines: string[] = [];
rl.on('line', (line: string) => lines.push(line.trim()));
rl.on('close', () => {
    const n = parseInt(lines[0]);
    const cost: number[][] = [];
    for (let i = 0; i < n; i++) {
        cost.push(lines[1 + i].split(' ').map(Number));
    }
    console.log(bitmaskDp(n, cost));
});
