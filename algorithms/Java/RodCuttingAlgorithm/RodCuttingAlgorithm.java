import java.util.*;
class RodCuttingAlgorithm
{
	public static void main(String args[])
	{
		Scanner sc=new Scanner(System.in); 
		int n=0;
		System.out.println("Enter the size of rod");
		n=sc.nextInt();
		int arr[]=new int[n];
		System.out.println("Enter the prices");
		for(int i=0;i<n;i++)
		{
			arr[i]=sc.nextInt();
		}
		rod ob=new rod();
		int ans=ob.rodcut(arr,n);
		System.out.println(ans);
	}
}

class rod
{
	public int rodcut(int p[],int n)
	{
		int r[]=new int[n];
		for(int i=0;i<n;i++)
		{
			r[i]=Integer.MIN_VALUE;
		}
		return calculating(p,r,n); 
	}
	public int calculating(int p[],int r[],int n)
	{
		int q;
		if(n==0)
		{
			return 0;
		}
		if(r[n-1]>=0)
		{
			return r[n-1];
		}
		else
		{
			int i;
			q=Integer.MIN_VALUE;
			for(i=0;i<n;i++)
			{
				q=max(q,p[i]+calculating(p,r,n-i-1));
			}
			r[n-1]=q;
			return q;
		}
		

	}
	public int max(int a,int b)
	{
		if(a>b)
		{
			return a;
		
}		else 
		{
			return b;
		}
	}
}
