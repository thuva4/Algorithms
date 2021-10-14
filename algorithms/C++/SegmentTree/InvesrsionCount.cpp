#include<bits/stdc++.h>
using namespace std;
#define siz 200000
long long int tree[4*siz+1],cnt;
pair<int,int> a[siz+1];
void update(int node,int l,int r,int ind)
{
    if(l>r)
        return;
    if(l==r)
    {
        tree[node]=1;
        return;
    }
    int mid=l+((r-l)>>1);
    if(ind<=mid)
        update((node<<1),l,mid,ind);
    else
        cnt+=tree[(node<<1)],update((node<<1)+1,mid+1,r,ind);
    tree[node]=tree[(node<<1)]+tree[(node<<1)+1];
}

int main()
{
    int t,n,r,maxi;
    scanf("%d",&t);
    while(t--)
    {
        cnt=0;
        scanf("%d",&n);
        for(int i=1;i<=n;i++)
        {
            scanf("%d",&a[i].first);
            a[i].second=i;
        }
        sort(a+1,a+n+1,greater<pair<int,int> >());
	    long long int ans=0;
	    for(int i=1;i<=n;i++)
	        update(1,1,n,a[i].second);
        printf("%lld\n",cnt);
        memset(tree,0,sizeof(tree));
    }
}
