#include <bits/stdc++.h>
using namespace std;
// Linearly search x in arr[].  If x is present then return its
// location,  otherwise return -1
int search(int arr[], int n, int x)
{
    int i;
    for (i=0; i<n; i++)
        if (arr[i] == x)
         return i;
    return -1;
}

int main()
{
    int a[10];
    int n;
    cout<<"enter the number of elements";
    cin>>n;
    cout<<"enter the elements:";
    for(i=0;i<n;i++){
        cin>>a[i];
    }
    int x;
    int position;
    cout<<"Enter the element to search for"<<endl;
    cin>>x;
    position=search(a,n,x);
    if(position==-1)
    {
        cout<<x<<" is not present in the array "<<endl;
    }
    else
    {
        cout<<x<<" is present at position "<<position<<endl;
    }
    return 0;
}
