#include <iostream>
using namespace std;
void initialize(int arr[], int n) {
    for(int i=1;i<=n;i++)
        arr[i]=i;
}
int root(int arr[], int i) {
    while(arr[i] != i) { i = arr[i]; }
    return i;
}
bool unionFind(int p, int q) {
    if(root(p)==root(q)) return true;
    else return false;
}
