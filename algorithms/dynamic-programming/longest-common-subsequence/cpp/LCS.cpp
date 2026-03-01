/* A Naive recursive implementation of LCS problem */
#include<bits/stdc++.h>
 
int max(int a, int b);
 
/* Returns length of LCS for X[0..m-1], Y[0..n-1] */
int lcs( char *X, char *Y, int m, int n )
{
   if (m == 0 || n == 0)
     return 0;
   if (X[m-1] == Y[n-1])
     return 1 + lcs(X, Y, m-1, n-1);
   else
     return max(lcs(X, Y, m, n-1), lcs(X, Y, m-1, n));
}
 
/* Utility function to get max of 2 integers */
int max(int a, int b)
{
    return (a > b)? a : b;
}
 
/* Driver program to test above function */
int main()
{
  char X[] = "AGGTAB";
  char Y[] = "GXTXAYB";
 
  int m = strlen(X);
  int n = strlen(Y);
 
  printf("Length of LCS is %dn", lcs( X, Y, m, n ) );
 
  return 0;
}
#include <algorithm>
#include <string>
#include <vector>

int lcs(const std::string& string1, const std::string& string2) {
    std::vector<int> previous(string2.size() + 1, 0);
    std::vector<int> current(string2.size() + 1, 0);

    for (std::size_t i = 1; i <= string1.size(); ++i) {
        for (std::size_t j = 1; j <= string2.size(); ++j) {
            if (string1[i - 1] == string2[j - 1]) {
                current[j] = previous[j - 1] + 1;
            } else {
                current[j] = std::max(previous[j], current[j - 1]);
            }
        }
        std::swap(previous, current);
        std::fill(current.begin(), current.end(), 0);
    }

    return previous.back();
}
