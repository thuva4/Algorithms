import java.util.HashSet;
import java.util.Set;

public class NQueens {

    private int count;
    private Set<Integer> cols;
    private Set<Integer> diags;
    private Set<Integer> antiDiags;

    public static int nQueens(int n) {
        if (n <= 0) {
            return 0;
        }
        NQueens solver = new NQueens();
        solver.count = 0;
        solver.cols = new HashSet<>();
        solver.diags = new HashSet<>();
        solver.antiDiags = new HashSet<>();
        solver.backtrack(0, n);
        return solver.count;
    }

    private void backtrack(int row, int n) {
        if (row == n) {
            count++;
            return;
        }
        for (int col = 0; col < n; col++) {
            if (cols.contains(col) || diags.contains(row - col) || antiDiags.contains(row + col)) {
                continue;
            }
            cols.add(col);
            diags.add(row - col);
            antiDiags.add(row + col);
            backtrack(row + 1, n);
            cols.remove(col);
            diags.remove(row - col);
            antiDiags.remove(row + col);
        }
    }
}
