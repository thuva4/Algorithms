#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
#include <sstream>
#include <queue>
#include <deque>
#include <bitset>
#include <iterator>
#include <list>
#include <stack>
#include <map>
#include <unordered_map>
#include <set>
#include <functional>
#include <numeric>
#include <utility>
#include <limits>
#include <time.h>
#include <math.h>
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <assert.h>
using namespace std;
const int max_array_size = 2e6+10;
int parent[max_array_size];
int size_set[max_array_size];

void make_set(int node)
{
    //This method make every element a single set 
    // if the element is say 1
    // them the size of '1' is '1'
    // and the parent of '1' is '1' only
    parent[node] = node;
    size_set[node] = 1;
}

int find_parent(int node)
{
    //this find_parent is actually a path compression
    //its recursive in nature, so that we can have a reduced time 
    //complexity
    if(node == parent[node])
    {
        return parent[node];
    }
    return parent[node] = find_parent(parent[node]); 
}

void union_set(int a, int b)
{
    //This union method takes two numbers, find their 
    //parents, and merge them into a set by using the size of 
    //the sets, the idea being to attach a smaller size set 
    // to the bigger one
    a = find_parent(a);
    b = find_parent(b);
    if(a != b)
    {
        if(size_set[a] < size_set[b])
        {
            swap(a, b);
        }
        parent[b] = a;
        size_set[a] += size_set[b];
    }
}

int main()
{
    int n;    //Enter the number of elements you want in to store
    cin>>n;
    int store[n+1]; // For storing the numbers
    for(int i=0;i<n;i++)
    {
        cin>>store[i];
        make_set(store[i]);
    }
    int a, b;  //Any two indices which you want to make a set
    cin>>a>>b;
    union_set(store[a], store[b]);
    cout<<find_parent(store[a])<<"\n";
    cout<<find_parent(store[b])<<"\n";
    return 0;
}