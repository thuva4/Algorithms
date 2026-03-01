// CALCULATING nC0 + nC1 + ... + nCr

/*  AUTHOR:AKASH JAIN
*   USERNAME:akash19jain    
*   DATE:09/09/2019 
*/

#define MAX1 100005    //assuming we need first 1000 rows 

ll triangle[MAX1+1];
ll makeTriangle(ll n,ll r)
{
	MEM(triangle,0);
    triangle[0]=1;   //C(0,0)=1;

    FOR(i,1,n)
    {
        FORD(j,i,1)
		{
            triangle[j]+=triangle[j-1];
			triangle[j]%=MOD;
		}
    }
	ll ans=0;
	REP(i,r+1)
	{
		ans+=triangle[i];
		ans%=MOD;
	}
	return ans;
}
