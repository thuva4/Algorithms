#include<stdio.h>

int main()
{
	int curr, k, j, n, a[10000], mid, high, low, i, flag=0;
	scanf("%d%d",&n, &k);
	for(i=0; i<n; i++) 
	scanf("%d",&a[i]);

	for(i=1; i<n; i++)
	{
		curr=a[i];
		j=i-1;
		
		while(j>=0 && a[j]>curr)
		{
			a[j+1]=a[j];
			j--;
		}
		
		a[j+1]=curr;
	}
	
	low=0; high=n-1;
	
	while(high>=mid)
	{
		mid=(low+high)/2;
		
		if (a[mid]==k) 
		{
			break;
		}
				
		if (k>a[mid]) 
		{ 
			low=mid+1; 
			continue;
		}
				
		if (k<a[mid]) 
		{
		       high=mid-1; 
		       continue;
		}
	}
				
	if (a[mid]==k) printf("YES\n");
				
	else printf("NO\n");
				
	return 0;
}
