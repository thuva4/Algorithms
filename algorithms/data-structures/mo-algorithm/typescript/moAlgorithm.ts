export function moAlgorithm(n: number, arr: number[], queries: [number, number][]): number[] {
    const q = queries.length;
    const block = Math.max(1, Math.floor(Math.sqrt(n)));
    const order = Array.from({ length: q }, (_, i) => i);
    order.sort((a, b) => {
        const ba = Math.floor(queries[a][0] / block);
        const bb = Math.floor(queries[b][0] / block);
        if (ba !== bb) return ba - bb;
        return ba % 2 === 0 ? queries[a][1] - queries[b][1] : queries[b][1] - queries[a][1];
    });

    const results = new Array(q).fill(0);
    let curL = 0, curR = -1, curSum = 0;

    for (const idx of order) {
        const [l, r] = queries[idx];
        while (curR < r) curSum += arr[++curR];
        while (curL > l) curSum += arr[--curL];
        while (curR > r) curSum -= arr[curR--];
        while (curL < l) curSum -= arr[curL++];
        results[idx] = curSum;
    }
    return results;
}

const input = require("fs").readFileSync("/dev/stdin", "utf8").trim().split(/\s+/).map(Number);
let idx = 0;
const n = input[idx++];
const arr = input.slice(idx, idx + n); idx += n;
const q = input[idx++];
const queries: [number, number][] = [];
for (let i = 0; i < q; i++) {
    queries.push([input[idx++], input[idx++]]);
}
console.log(moAlgorithm(n, arr, queries).join(" "));
