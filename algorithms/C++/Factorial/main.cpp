#include <iostream>
using namespace std;

int factorial(int n){
    if(n<0)
    {
        cout << "Factorial of negative integers isn't defined.";
        return -1;
    }
    int total=1;
    for(int i =1;i<=n;i++){
        total*=i;
    }

    return total;
}

int main(){
    factorial(5);
    return 0;
}