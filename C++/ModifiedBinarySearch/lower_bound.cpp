
#include <iostream>
using namespace std;
//Modified Binary Search to find the lower bound of a key if present in the array
//Lower bound is the index of the first occurrence of a given key
// if a[]={1,2,2,3,4,5,5,6}
// lower_bound for key 2 is 1
// lower_bound for key 5 is 5

int lower_bound(int low,int high,int key)
{
    int result=-1;
// result is to keep track of the previous index found if any

    while(low<=high)
    {
        int mid=(low + high)/2;

        if(a[mid]==key)
        {
            result=mid;
            high=mid-1;

        }
        else if(a[mid]< key)
        {
            low=mid +1;
        }
        else if(a[mid]>key)
        {
            high=mid-1;
        }

    }
    return result;
}

int main()
{   
    int n;
    cin>>n;
    
    for(int i=0;i<n;i++)
        cin>>a[i];
        int x;
        cin>>x;
    cout<<lower_bound(0,n-1,x);
}
