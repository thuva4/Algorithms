#include <iostream>
#include <vector>
#include <cmath>
using namespace std;

int matrixDeterminant(const vector<int>& arr) {
    int idx = 0; int n = arr[idx++];
    vector<vector<double>> mat(n, vector<double>(n));
    for (int i = 0; i < n; i++) for (int j = 0; j < n; j++) mat[i][j] = arr[idx++];

    double det = 1.0;
    for (int col = 0; col < n; col++) {
        int maxRow = col;
        for (int row = col+1; row < n; row++)
            if (fabs(mat[row][col]) > fabs(mat[maxRow][col])) maxRow = row;
        if (maxRow != col) { swap(mat[col], mat[maxRow]); det *= -1; }
        if (mat[col][col] == 0) return 0;
        det *= mat[col][col];
        for (int row = col+1; row < n; row++) {
            double f = mat[row][col] / mat[col][col];
            for (int j = col+1; j < n; j++) mat[row][j] -= f * mat[col][j];
        }
    }
    return (int)round(det);
}

int main() {
    cout << matrixDeterminant({2, 1, 2, 3, 4}) << endl;
    cout << matrixDeterminant({2, 1, 0, 0, 1}) << endl;
    cout << matrixDeterminant({3, 6, 1, 1, 4, -2, 5, 2, 8, 7}) << endl;
    cout << matrixDeterminant({1, 5}) << endl;
    return 0;
}
