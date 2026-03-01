#include<bits/stdc++.h>
using namespace std;

const int MOD =  1e9;

struct A { 
    long long m[2][2];
    A operator * (const A & o) const {
        A temp;
        for(int i = 0; i < 2; i++) {
            for(int j = 0; j < 2; j++){
                temp.m[i][j] = 0;
                for(int k = 0; k < 2; k++){
                    temp.m[i][j] += m[i][k]*o.m[k][j];
                    temp.m[i][j] %= MOD;
                }
                temp.m[i][j] %= MOD;
            }
        }
        return temp;
    }
};

A mat[100];
A ans;

int main(){
    cout << "input a number upto 2^62" << endl;
    mat[0] = {1,1,1,0};
    for(int i = 1; i <= 62; i++) {
        mat[i] = mat[i-1]*mat[i-1];
    }
    long long n;
    scanf("%lld", &n);
    ans = {1,0,1,0};
    for(int i = 0; i <= 62; i++) {
        if ((1ll<<i) & (n-1)) {
            ans = ans * mat[i];
        }
    }
    cout << n << "th fibonacci number is equivalent to " << ans.m[0][0] << " mod " << MOD << endl;
    return 0;
}