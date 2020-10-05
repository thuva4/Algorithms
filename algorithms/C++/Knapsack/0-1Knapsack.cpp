//Solved using Dynamic Programming approach
//Time Complexity - O(n*w)
//Space Complexity - 0(n*w)

#include <bits/stdc++.h> 
using namespace std; 
  
//greedy function that returns max. value that can be pushed in the knapsack 
int knapSack(int W, vector<int> value, vector<int> weight, int n) 
{  
    int dp[n + 1][W + 1]; 
  
    // build table dp[][] in bottom up manner 
    for (int i = 0; i <= n; i++) 
    { 
        for (int w = 0; w <= W; w++) 
        { 
            if (i == 0 || w == 0) 
                dp[i][w] = 0; 
            else if (weight[i - 1] <= w) 
                dp[i][w] = max(value[i - 1] + dp[i - 1][w - weight[i - 1]], dp[i - 1][w]); 
            else
                dp[i][w] = dp[i - 1][w]; 
        } 
    } 
  
    return dp[n][W]; 
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

    cout << "Maximum value we can obtain = "<< knapSack(W, value, weight, n); 
    return 0; 
} 
