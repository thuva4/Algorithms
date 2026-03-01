#include <unordered_set>

static int count;
static std::unordered_set<int> cols;
static std::unordered_set<int> diags;
static std::unordered_set<int> antiDiags;

void backtrack(int row, int n) {
    if (row == n) {
        count++;
        return;
    }
    for (int col = 0; col < n; col++) {
        if (cols.count(col) || diags.count(row - col) || antiDiags.count(row + col)) {
            continue;
        }
        cols.insert(col);
        diags.insert(row - col);
        antiDiags.insert(row + col);
        backtrack(row + 1, n);
        cols.erase(col);
        diags.erase(row - col);
        antiDiags.erase(row + col);
    }
}

int nQueens(int n) {
    if (n <= 0) {
        return 0;
    }
    count = 0;
    cols.clear();
    diags.clear();
    antiDiags.clear();
    backtrack(0, n);
    return count;
}
