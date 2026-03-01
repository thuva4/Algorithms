// Sourav Verma (SrGrace)


#include<bits/stdc++.h>
using namespace std;

int main()
{
    // Fast I/O
    ios_base::sync_with_stdio(false); cin.tie(nullptr);
    
    int a[] = {-2, -3, 4, -1, -2, 1, 5, -3};
    int n = sizeof(a)/sizeof(a[0]);
    
    int max_so_far = a[0], max_ending_here = a[0];
    
    for(int i=0; i<n; i++) {
        max_ending_here = max(a[i], max_ending_here + a[i]);
        max_so_far = max(max_so_far, max_ending_here);
    }
    
    cout<<"Maximum Subarray Sum = "<<max_so_far<<"\n";
      
    return 0;
}
