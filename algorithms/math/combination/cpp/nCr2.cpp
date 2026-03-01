// CALCULATING nCr BY PASCALS TRIANGLES
/*  AUTHOR:AKASH JAIN
*   USERNAME:akash19jain    
*   DATE:09/09/2019 
*/
#define MAX 1000    //assuming we need first 1000 rows 

ll triangle[MAX+1][MAX+1];
void makeTriangle()
{
    triangle[0][0]=1;   //C(0,0)=1;

    FOR(i,1,MAX-1)
    {
        triangle[i][0]=1;   //C(i,0)=1;
        FOR(j,1,i)
            triangle[i][j]=triangle[i-1][j-1]+triangle[i-1][j];
    }

}
ll ncr(ll n,ll r)
{
    return triangle[n][r];
}

/*In this approach, you'll be actually building up the Pascal's Triangle. 
The dynamic approach is much faster than the recursive one (the first one is O(n^2) while the other is exponential).
 However, you'll need to use O(n^2) memory too. 
 Then you can look up any C(n, r) in O(1) time. */
