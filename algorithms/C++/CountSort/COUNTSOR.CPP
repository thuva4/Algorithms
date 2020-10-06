#include<iostream.h>
#include<conio.h>
#define max 20
int a[max];
void getdata(int n)
{cout<<"enter elements";
int i;
for(i=0;i<n;i++)
{cin>>a[i];
}

}
int maxi(int n)
{int i,j,jl;
for(i=0;i<1;i++)
{jl=a[i];
for(j=1;j<n;j++)
	{if(jl<a[j])
	    jl=a[j];
	}
}
return jl;
}
int main()
{clrscr();
int b,i,n,j;
cout<<"enter number of elements";
cin>>n;
getdata(n);
b=maxi(n);
int *p=new int[b+1];
for(i=0;i<b+1;i++)
{p[i]=0;
}
for(i=0;i<n;i++)
{p[a[i]]++;
}
i=0,j=0;
while(j<max+1)
{if(p[j]>0)
	{a[i]=j;
	i++;
	p[j]--;
	}
else j++;
}
for(i=0;i<n;i++)
cout<<a[i]<<"\t";
getch();
return 0;
}