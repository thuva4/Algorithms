#include <bits/stdc++.h> 
using namespace std; 

/*
	This is an implementation of a 0-1 Knapsack problem. 
	Fractionla Knapsack problem can also accomodate the possibilites 
	in fractions. 
	A 0-1 Knapsack problem means that either a full quantity is selected at once,
	or none is selected. 
*/  

/* A recursive implementation of the 0-1 KnapSack problem */ 
int knapSack(int W, vector<int> &wt, vector<int> &val, int n) { 
	if (n == 0 || W == 0)  
		return 0;  
	  
	if (wt[n-1] > W)  
		return knapSack(W, wt, val, n-1);
	 
	else return max(val[n-1] + knapSack(W - wt[n-1], wt, val, n - 1), knapSack(W, wt, val, n - 1));  
}  
  
/* Driver program to run the KnapSack problem */ 
int main() {  
   	cout << "Enter the number of weights : "; 
    	int n; 
    	cin >> n; 
    
   	vector<int> val(n); 
   	vector<int> wt(n); 
   	
   	cout << "Enter the weights : " << endl; 
   	for (int i = 0; i < n; i++) {
   		cin >> wt[i]; 
   	}
   	cout << "Enter the value of the weights : " << endl; 
   	for (int i = 0; i < n; i++) {
   		cin >> val[i]; 
   	}
   	cout << "What is the weight of the knapsack available : " << endl; 
   	int W; 
   	cin >> W; 
        int value = knapSack(W, wt, val, n);  
        cout << "The KnapSack value is : " << endl; 
        cout << value << endl; 
        return 0;  
}  
