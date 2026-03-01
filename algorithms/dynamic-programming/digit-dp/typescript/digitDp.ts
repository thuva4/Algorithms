export function digitDp(n: number, targetSum: number): number {
    if (n <= 0) return 0;

    const s = n.toString();
    const numDigits = s.length;
    const digits = s.split('').map(Number);

    const memo: Map<string, number> = new Map();

    function solve(pos: number, currentSum: number, tight: boolean): number {
        if (currentSum > targetSum) return 0;
        if (pos === numDigits) {
            return currentSum === targetSum ? 1 : 0;
        }

        const key = `${pos},${currentSum},${tight ? 1 : 0}`;
        if (memo.has(key)) return memo.get(key)!;

        const limit = tight ? digits[pos] : 9;
        let result = 0;
        for (let d = 0; d <= limit; d++) {
            result += solve(pos + 1, currentSum + d, tight && d === limit);
        }

        memo.set(key, result);
        return result;
    }

    const count = solve(0, 0, true);
    return targetSum === 0 ? count - 1 : count;
}
