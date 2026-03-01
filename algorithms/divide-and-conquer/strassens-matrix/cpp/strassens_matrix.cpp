#include <vector>

using namespace std;
typedef vector<vector<int>> Mat;

static Mat makeMat(int n) { return Mat(n, vector<int>(n, 0)); }

static Mat subMat(const Mat& m, int r, int c, int sz) {
    Mat res = makeMat(sz);
    for (int i = 0; i < sz; i++)
        for (int j = 0; j < sz; j++)
            res[i][j] = m[r+i][c+j];
    return res;
}

static Mat addMat(const Mat& a, const Mat& b, int sz) {
    Mat r = makeMat(sz);
    for (int i = 0; i < sz; i++)
        for (int j = 0; j < sz; j++)
            r[i][j] = a[i][j] + b[i][j];
    return r;
}

static Mat subMat2(const Mat& a, const Mat& b, int sz) {
    Mat r = makeMat(sz);
    for (int i = 0; i < sz; i++)
        for (int j = 0; j < sz; j++)
            r[i][j] = a[i][j] - b[i][j];
    return r;
}

static Mat multiply(const Mat& a, const Mat& b, int n) {
    Mat c = makeMat(n);
    if (n == 1) { c[0][0] = a[0][0] * b[0][0]; return c; }

    int h = n / 2;
    Mat a11 = subMat(a,0,0,h), a12 = subMat(a,0,h,h);
    Mat a21 = subMat(a,h,0,h), a22 = subMat(a,h,h,h);
    Mat b11 = subMat(b,0,0,h), b12 = subMat(b,0,h,h);
    Mat b21 = subMat(b,h,0,h), b22 = subMat(b,h,h,h);

    Mat m1 = multiply(addMat(a11,a22,h), addMat(b11,b22,h), h);
    Mat m2 = multiply(addMat(a21,a22,h), b11, h);
    Mat m3 = multiply(a11, subMat2(b12,b22,h), h);
    Mat m4 = multiply(a22, subMat2(b21,b11,h), h);
    Mat m5 = multiply(addMat(a11,a12,h), b22, h);
    Mat m6 = multiply(subMat2(a21,a11,h), addMat(b11,b12,h), h);
    Mat m7 = multiply(subMat2(a12,a22,h), addMat(b21,b22,h), h);

    Mat c11 = addMat(subMat2(addMat(m1,m4,h),m5,h),m7,h);
    Mat c12 = addMat(m3,m5,h);
    Mat c21 = addMat(m2,m4,h);
    Mat c22 = addMat(subMat2(addMat(m1,m3,h),m2,h),m6,h);

    for (int i = 0; i < h; i++)
        for (int j = 0; j < h; j++) {
            c[i][j]=c11[i][j]; c[i][j+h]=c12[i][j];
            c[i+h][j]=c21[i][j]; c[i+h][j+h]=c22[i][j];
        }
    return c;
}

vector<int> strassens_matrix(vector<int> arr) {
    int n = arr[0];
    int sz = 1;
    while (sz < n) sz *= 2;

    Mat a = makeMat(sz), b = makeMat(sz);
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++) {
            a[i][j] = arr[1 + i*n + j];
            b[i][j] = arr[1 + n*n + i*n + j];
        }

    Mat result = multiply(a, b, sz);

    vector<int> out;
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            out.push_back(result[i][j]);
    return out;
}
