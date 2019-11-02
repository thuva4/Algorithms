/*Lucas Theorem,  non negative integers n and r and a prime p. p should be <= 10^4. Time Complexity (p^2 + (log n to the base p))*/

long long nCrModpDP(long long n, int r,long long p) 
{ 
    long long C[r+1]; 
    memset(C, 0, sizeof(C)); 
    C[0] = 1; 
    for (int i = 1; i <= n; i++)    { 
        for (int j = min(i, r); j > 0; j--) 
            C[j] = (C[j] + C[j-1])%p; 
    } 
    return C[r]; 
} 

long long nCrModp_LucasTheorem(long long n, long long r, long long p) 
{   
    if(r > n)   {
        return 0;
    }
    if(n < 0 || r < 0)  {
        return 0;
    }
    if (r==0) 
        return 1; 
    long long ni = n%p;
    long long ri = r%p; 
    return (nCrModp_LucasTheorem(n/p, r/p, p) * nCrModpDP(ni, ri, p)) % p; 
}

