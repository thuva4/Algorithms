/*For every number i where i varies from 2 to N-1:
    Check if the number is prime. If the number
    is prime, store it in prime array.
For every prime numbers j less than or equal to the smallest  
prime factor p of i:
    Mark all numbers j*p as non_prime.
    Mark smallest prime factor of j*p as j */


ll n;
ll lp[100000];
ll prime[100000],a=0;
void sieve(ll n)
{
    for(ll i=2;i<=n;i++)
    {
        if(lp[i]==0)
        {
            lp[i]=i;
            prime[a++]=i;
        }
        for(ll j=0;j<a && prime[j]<=lp[i] && i*prime[j]<=n;j++)
        {
            lp[i*prime[j]]=prime[j];
        }
        
    }
}

int main()
{
    SC1(n);
    sieve(n);
    for(ll i=0;i<a;i++)
        printf("%lld ",prime[i]);
}
