#include <iostream>
#define N 100005

using namespace std;

int a[N], n;

int main() {
	cin >> n;
	for(int i = 0 ; i < n ; i++)
		cin >> a[i];
	for(int i = 0 ; i < n ; i++)
		for(int j = 0 ; j < n - i - 1 ; j++)
			if(a[j] > a[j + 1])
				a[j] = a[j] + a[j + 1] - (a[j + 1] = a[j]);
	for(int i = 0 ; i < n ; i++)
		cout << a[i] << " ";
	cout << "\n";
	return 0;
}