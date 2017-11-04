/*
* Basic Euclidean Algorithm
* Time-Complexity:- O(Log min(a, b))
*/

int gcd(int a,int b){
		if(b==0){
			return a;
		}
		else
			return gcd(b,a%b);
}
