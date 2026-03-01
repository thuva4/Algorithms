export function sosDp(n: number, f: number[]): number[] {
    const size = 1 << n;
    const sos = [...f];

    for (let i = 0; i < n; i++) {
        for (let mask = 0; mask < size; mask++) {
            if (mask & (1 << i)) {
                sos[mask] += sos[mask ^ (1 << i)];
            }
        }
    }
    return sos;
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
const lines: string[] = [];
rl.on('line', (line: string) => lines.push(line.trim()));
rl.on('close', () => {
    const n = parseInt(lines[0]);
    const f = lines[1].split(' ').map(Number);
    const result = sosDp(n, f);
    console.log(result.join(' '));
});
