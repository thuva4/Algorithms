#include <iostream>
#include <vector>
#include <cmath>
using namespace std;

int gaussianElimination(const vector<int>& arr) {
    int idx = 0; int n = arr[idx++];
    vector<vector<double>> mat(n, vector<double>(n+1));
    for (int i = 0; i < n; i++) for (int j = 0; j <= n; j++) mat[i][j] = arr[idx++];

    for (int col = 0; col < n; col++) {
        int maxRow = col;
        for (int row = col+1; row < n; row++)
            if (fabs(mat[row][col]) > fabs(mat[maxRow][col])) maxRow = row;
        swap(mat[col], mat[maxRow]);
        for (int row = col+1; row < n; row++) {
            if (mat[col][col] == 0) continue;
            double f = mat[row][col] / mat[col][col];
            for (int j = col; j <= n; j++) mat[row][j] -= f * mat[col][j];
        }
    }

    vector<double> sol(n);
    for (int i = n-1; i >= 0; i--) {
        sol[i] = mat[i][n];
        for (int j = i+1; j < n; j++) sol[i] -= mat[i][j] * sol[j];
        sol[i] /= mat[i][i];
    }

    double sum = 0; for (auto s : sol) sum += s;
    return (int)round(sum);
}

int main() {
    cout << gaussianElimination({2, 1, 1, 3, 2, 1, 4}) << endl;
    cout << gaussianElimination({2, 1, 0, 5, 0, 1, 3}) << endl;
    cout << gaussianElimination({1, 2, 6}) << endl;
    cout << gaussianElimination({3, 1, 1, 1, 6, 0, 2, 1, 5, 0, 0, 3, 9}) << endl;
    return 0;
}
