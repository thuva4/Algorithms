//Repetition of items allowed
//Solved using Dynamic Programming approach
//Time Complexity - O(n*w)
//Space Complexity - 0(w)

#include<bits/stdc++.h> 
using namespace std; 
  
//function that returns max. value that can be pushed in the knapsack 
int unboundedKnapsack(int W, vector<int> value, vector<int> weight, int n) 
{ 
    // dp[i] represents maximum value that is obtainable with knapsack capacity i. 
    vector<int> dp(W+1, 0);
  
    for (int i=0; i<=W; i++) 
      for (int j=0; j<n; j++) 
         if (weight[j] <= i) 
            dp[i] = max(dp[i], dp[i-weight[j]]+value[j]); 
  
    return dp[W]; 
} 
  
int main() 
{ 
    int W;                               //Weight of knapsack
    cin>>W; 

    int n;                              //no. of available items
    cin>>n;
    vector<int> value(n);      //stores value of each item
    vector<int> weight(n);     //stores weight of each item

    for(int i=0; i<n; i++)
    {
        int v, w;
        cin>>v>>w;

        value.push_back(v);
        weight.push_back(w);
    }

    cout << "Maximum value we can obtain = "<< unboundedKnapsack(W, value, weight, n); 
    return 0; 
} 
