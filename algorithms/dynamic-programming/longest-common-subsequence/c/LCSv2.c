
int max(int p , int q)
{
    return (p > q) ? p : q;
}

int lcs( char *a, char *b, int m, int n )    // a and b are the character arrays 
                                            // m and n are their sizes respectively
 {
    if (m == 0 || n == 0)
      return 0;
    if (a[m-1] == b[n-1])
      return 1 + lcs(a, b, m-1, n-1);
    else
      return max(lcs(a, b, m, n-1), lcs(a, b, m-1, n));
 }
