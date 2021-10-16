#include <iostream>
using namespace std;
// This Program Checks If A Number Is Prime Or Not And Returns An Output. 
// By Mr Techtroid
int main() {
  int n;
    cout<<"Number:";
    cin>>n;
    int a = 0;
    for(int i=1;i<=(n/2);i++)
    {
        if(n%i==0 & i!=1)
        {
            break;
        }
        if (i == n/2){
            a = 1;
        }
    }
    if(a==1){cout << "Number is Prime" << endl;}
    else {cout << "Number Is NOT A Prime" << endl;}
    return 0;
}
