#include<bits/stdc++.h>
using namespace std;
typedef long long ll;
unordered_map<ll,ll> arr;
ll Fibo(ll n)
{
    if(n==0)
    {
        return 0;
    }
    if(arr[n]!=0)
    {
        return (arr[n]);
    }
    if(n&1)
    {
        ll x=(n+1)/2;
        ll ans1=Fibo(x);
        ans1=(ans1*ans1);
        ll ans2=Fibo(x-1);
        ans2=(ans2*ans2);
        ll ans=(ans1+ans2);
        arr[n]=ans;
        return arr[n];
    }
    else
    {
        ll x=n/2;
        ll ans1=Fibo(x);
        ll ans2=Fibo(x-1);
        ll ans3=Fibo(x+1);
        //cout<<ans1<<ans2<<ans3;
        ll ans=ans1*(ans2+ans3);
        arr[n]=ans;
        return arr[n];
    }
}
int main()
{
    arr[0]=0;
    arr[1]=1;
    arr[2]=1;
    cout<<"Enter n to find the nth fibonacci number -\n";
    ll n;
    cin>>n;
    ll ans=Fibo(n);
    cout<<n<<"th Fibonacci number is "<<ans<<endl;
    return 0;
}

