#include <bits/stdc++.h>
using namespace std;

int lcs( string X , string Y )
{
  int m = X.size();
  int n = Y.size();
  int dp[m+1][n+1];

  for (int i=0; i<=m; i++)
  {
    for (int j=0; j<=n; j++)
    {
      if (i == 0 || j == 0)
        dp[i][j] = 0;

      else if (X[i-1] == Y[j-1])
        dp[i][j] = dp[i-1][j-1] + 1;

      else
        dp[i][j] = max(dp[i-1][j], dp[i][j-1]);
    }
  }

  /* L[m][n] contains length of LCS for X[0..n-1] and Y[0..m-1] */
  return dp[m][n];
}

int main()
{
  string X = "mississippi";
  string Y = "messi";
  cout<<"Length of longest common subsequence is : "<<lcs(X,Y)<<endl;
  return 0;
}
