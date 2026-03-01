//Solved using Greedy approach
//Time Complexity - O(nlogn)
//Space Complexity - O(1)

#include <bits/stdc++.h> 
using namespace std; 
  
// Comparator function to sort items according to value/weight ratio in desc order
bool cmp(pair<int, int> a, pair<int, int> b) 
{ 
    double r1 = (double)a.first / a.second; 
    double r2 = (double)b.first / b.second; 
    return r1 > r2; 
} 
  
//greedy function that returns max. value that can be pushed in the knapsack
double fractionalKnapsack(int W, vector<pair<int, int>> item, int n) 
{ 
    //    sorting items on basis of ratio of value and weight in descending order
    sort(item.begin(), item.end(), cmp); 
  
    int curWeight = 0;        // Current weight in knapsack 
    double finalvalue = 0.0;  // Result (value in Knapsack) 
  
    for (int i = 0; i < n; i++) 
    { 
        // If adding the ith doesn't cause overflow, add it completely 
        if (curWeight + item[i].second <= W) 
        { 
            curWeight += item[i].second; 
            finalvalue += item[i].first; 
        } 
        else    // If overflow, add fractional part of it 
        { 
            int remain = W - curWeight; 
            finalvalue += item[i].first * ((double) remain / item[i].second); 
            break; 
        } 
    } 
  
    return finalvalue; 
} 
  

int main() 
{ 
    int W;                               //Weight of knapsack
    cin>>W; 

    int n;                              //no. of available items
    cin>>n;
    vector<pair<int, int>> item(n);     //stores value and weight of each item

    for(int i=0; i<n; i++)
    {
        int v, w;
        cin>>v>>w;

        item.push_back(make_pair(v, w));
    }

    cout << "Maximum value we can obtain = "<< fractionalKnapsack(W, item, n); 
    return 0; 
} 
