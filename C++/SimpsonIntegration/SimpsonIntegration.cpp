#include <bits/stdc++.h>

using namespace std;

double f (double x){ // an user defined function
    double val = (x*x) + x + 1;
    return val;
}

int main(){

    long double a,b; // input data
    cin >> a >> b;
    const int N = 1000 * 1000; // number of steps (already multiplied by 2)
    double s = 0;
    double h = (b - a)/N;
    for(int i = 0; i <= N; i++){
        double x = a + h*i;
        s += f(x) * ((i == 0 || i == N) ? 1 : ((i&1) == 0) ? 2 : 4);
    }
    s *= h / 3;
    cout << s;
    
    return 0;
}
