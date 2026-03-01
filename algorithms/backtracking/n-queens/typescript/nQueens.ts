export function nQueens(n: number): number {
    if (n <= 0) {
        return 0;
    }

    let count = 0;
    const cols = new Set<number>();
    const diags = new Set<number>();
    const antiDiags = new Set<number>();

    function backtrack(row: number): void {
        if (row === n) {
            count++;
            return;
        }
        for (let col = 0; col < n; col++) {
            if (cols.has(col) || diags.has(row - col) || antiDiags.has(row + col)) {
                continue;
            }
            cols.add(col);
            diags.add(row - col);
            antiDiags.add(row + col);
            backtrack(row + 1);
            cols.delete(col);
            diags.delete(row - col);
            antiDiags.delete(row + col);
        }
    }

    backtrack(0);
    return count;
}
