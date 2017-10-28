// This function takes two strings as argument and returns an integer which is the no of times second string is appearing in the first string. eg. if the first string is "hibyehi" and second string is "hi" then the output will be 2 because hi is appearing 2 times in the main string. 

#include<stdio.h>
#include<string.h>
long long int  power(int x,long long int y)
{
	int mod=1000000007;
	if(y==0)
		return 1;
	long long int temp=(power(x,y/2)%mod);
	if (y%2==0)
		return (temp*temp)%mod;
	else
		return (((((x%mod)*temp)%mod)*temp%mod)%mod);
}
int main()
{
	long long int mod=1000000007,len1,len2,i,c[100000],d[100000]={0},e[100000],sum=0,com,count=0;
	char a[100000],b[100000];
	printf("Enter first(main) string:\n");
	scanf("%s",a);
	printf("Enter second string:\n");
	scanf("%s",b);
	len1=strlen(a);
	len2=strlen(b);
	for(i=0;i<len1;i++)
		c[i]=(power(26,i)%mod);
	com=power(26,1000000005);
	for(i=len1-1;i>=0;i--)
	{
		if(i==len1-1)
			d[i]=((c[len1-i-1]%mod)*(a[i]-'a'+1))%mod;
		else
			d[i]=(d[i+1]%mod+(c[len1-i-1]*(a[i]-'a'+1)%mod)%mod)%mod;
	}
	for(i=len2-1;i>=0;i--)
		sum+=(c[len2-i-1]*(b[i]-'a'+1))%mod;
	for(i=0;i<len1-len2+1;i++)
	{
		e[i]=(((d[i]-d[i+len2]+mod)%mod)*(power(com,len1-i-len2)%mod)%mod);
		if(e[i]==sum)
			count++;
	}
	printf("%lld\n",count);
	return 0;
}
