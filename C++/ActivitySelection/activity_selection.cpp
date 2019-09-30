#include<bits/stdc++.h>

using namespace std;

struct activity
{
	int start;
	int finish;
};

int compare(activity a,activity b)
{
	return( a.finish < b.finish);
}

vector<int> select(int s[],int f[],int n)
{
	activity arr[n];
	for(int i=0;i<n;i++)
	{
		arr[i].start = s[i];
		arr[i].finish = f[i];
	}
	sort(arr,arr+n,compare);
	for(int i=0;i<n;i++)
	{
		cout<<arr[i].finish<<" ";
	}
	cout<<endl;
	vector<int> act;
	act.push_back(0);
	int k = 0;
	for(int i=1;i<n;i++)
	{
		if(arr[i].start >= arr[k].finish)
		{
			k = i;
			act.push_back(i);
		}
	}
	return act;
}
int main()
{
	int s[] = {1, 3, 0, 5, 8, 5};
	int f[] = {2, 4, 6, 7, 9, 9};
	int n = sizeof(s)/sizeof(int);
	vector<int> res;
	res = select(s,f,n);
	for(auto x : res)
		cout<<x<<" ";
return 0;
}