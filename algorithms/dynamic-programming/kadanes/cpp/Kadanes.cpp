#include<bits/stdc++.h>
using namespace std;
int main(){
	vector<int> v={-2,-1,-5,3,7,-2,5,11,-10,-20,11};
	int n=v.size();
	int mini=*min_element(v.begin(),v.end());
	int maxval=mini,curval=mini;
	for(int i=0;i<n;i++){
		curval=max(curval+v[i],v[i]);
		maxval=max(maxval,curval);
	}
	cout<<"Maximum Subarray Sum = "<<maxval<<endl;
}
#include <algorithm>
#include <vector>

int kadane(const std::vector<int>& array_of_integers) {
    if (array_of_integers.empty()) {
        return 0;
    }

    int best = array_of_integers[0];
    int current = array_of_integers[0];
    for (std::size_t i = 1; i < array_of_integers.size(); ++i) {
        current = std::max(array_of_integers[i], current + array_of_integers[i]);
        best = std::max(best, current);
    }
    return best;
}
