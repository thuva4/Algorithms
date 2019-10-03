#include<iostream>

//a very simple program that uses euclidean algorithm to calculate the GCD of two numbers

using namespace std;

unsigned long long find_greatest_common_Factor(int a, int b)
{
    if(a==0)
        return b;
    else{
        return find_greatest_common_Factor(b%a,a);
    }
}

int main()
{
    unsigned long long a,b,gcf;
    cin>>a>>b;
    gcf = find_greatest_common_Factor(a,b);
    cout<<gcf<<endl;

}
