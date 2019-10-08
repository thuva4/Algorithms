#include <bits/stdc++.h>
using namespace std;

#define ll long long

vector<pair<int,int> > v; // pair : {value, weight}


bool comp(const pair<int,int> &a, const pair<int,int> &b) {
    double r1 = (double) a.first/a.second;
    double r2 = (double) b.first/b.second;
    return r1 > r2;
}

int fractional_knapsack(int n, int w) {
    sort(v.begin(), v.end(), comp);
    int cur_weight = 0,i;
    double final = 0.0;
    for(i=0;i<n;i++) {
        if(cur_weight + v[i].second <= w ) {
            cur_weight += v[i].second;
            final += v[i].first;
        }
        else {
            int left = w - cur_weight;
            final += v[i].first * ((double) left / v[i].second);
            break;
        }
    }
    return final;
}

int main() {
    int i,j, value, weight;
    int n; // number of items
    int w; // Total weight of knapsack
    cin>>w;
    cin>>n;
    for(i=0;i<n;i++) {
        cin>> value >> weight;
        v.push_back(make_pair(value, weight));
    }
    int max_total = fractional_knapsack(n, w);
    cout<< max_total << endl;
    return 0;
}
