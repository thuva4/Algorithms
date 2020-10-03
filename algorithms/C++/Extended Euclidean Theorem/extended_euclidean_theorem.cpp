#include<bits/stdc++.h>

using namespace std;


template<typename T>
T extendedEuclidean(T a, T b, T &x, T &y){
	if(b==0){
		x=1;
		y=0;
		return a;
	}
	T x1,y1;
	T d = extendedEuclidean(b, a%b, x1, y1);
	x = y1;
	y = x1 - y1*(a/b);
	return d;
}

int main(){
	int x,y,a=35, b=15;
	int g = extendedEuclidean(a, b, x, y);
	cout << x << " " << y << "\n";
	cout << g << "\n";
}