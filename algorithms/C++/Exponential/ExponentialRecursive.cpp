#include<bits/stdc++.h>

using namespace std;

int exponentrecursion(int x, int p){
    if (p==0){return 1;}
    int y, temp = exponentrecursion(x, p/2);
    y = temp*temp;
    if (p%2){y = y *x;}
    return y;
}

int main(){
    cout<<exponentrecursion(5,3);
    return 0;
}

