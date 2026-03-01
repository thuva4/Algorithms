export function sudokuSolve(board: number[]): number[] {
    const grid = [...board];

    function isValid(pos: number, num: number): boolean {
        const row = Math.floor(pos / 9);
        const col = pos % 9;

        // Check row
        for (let c = 0; c < 9; c++) {
            if (grid[row * 9 + c] === num) return false;
        }

        // Check column
        for (let r = 0; r < 9; r++) {
            if (grid[r * 9 + col] === num) return false;
        }

        // Check 3x3 box
        const boxRow = 3 * Math.floor(row / 3);
        const boxCol = 3 * Math.floor(col / 3);
        for (let r = boxRow; r < boxRow + 3; r++) {
            for (let c = boxCol; c < boxCol + 3; c++) {
                if (grid[r * 9 + c] === num) return false;
            }
        }

        return true;
    }

    function solve(): boolean {
        for (let i = 0; i < 81; i++) {
            if (grid[i] === 0) {
                for (let num = 1; num <= 9; num++) {
                    if (isValid(i, num)) {
                        grid[i] = num;
                        if (solve()) return true;
                        grid[i] = 0;
                    }
                }
                return false;
            }
        }
        return true;
    }

    if (solve()) {
        return grid;
    }
    return [];
}
