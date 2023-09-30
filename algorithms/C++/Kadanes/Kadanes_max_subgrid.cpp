#include <bits/stdc++.h>
using namespace std;

#define N 4

int maxSubGridSum(int grid[][N]){
    int ans = -200;
    int k[N];

    for(int l = 0 ; l < N; l++){
        for(int r = l; r < N; r++){
            for(int row = 0; row < N; row++){
                int sm = 0;
                for(int i = l; i <= r; i++){
                    sm += grid[row][i];
                }
                k[row] = sm;
            }
            int sm = 0;
            for(int i = 0 ;i < N; i++){
                sm += k[i];
                ans = max(ans, sm);
                if(sm < 0) sm = 0;
            }
        }
    }

    return ans;


}

int main() {
    int grid[N][N] = {{ 0, -2, -7,  0},
                      { 9,  2, -6,  2},
                      {-4,  1, -4,  1},
                      {-1,  8,  0, -2}};

    cout << "Max sub-grid sum is : " << maxSubGridSum(grid);
    return 0;
}
