#include <bits/stdc++.h>
using namespace std;
using LL = long long; 

int main() {
	cout << "Total Number of Elements : ";
	int n; 
	cin >> n; 
	int arr[n]; 
	cout << "Enter the numbers one by one : " << endl; 
	for (int i = 0; i < n; i++) {
		cin >> arr[i]; 
	}
	int permutations = 0; 
	cout << "The different permutations are : " << endl; 
	do {
		permutations++; 
		for (int i = 0; i < n; i++) {
			cout << arr[i] << " "; 
		}
		cout << endl; 
	} while (next_permutation(arr, arr + n)); 
	cout << "Total Number of Permutations : " << permutations << endl; 
}
