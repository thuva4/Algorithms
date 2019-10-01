// Find edit distance of two strings in C
// Max size of each string is 100 characters

#include <stdio.h>
#include <string.h>

int dp[102][102] = {0};

int min(int a, int b) { return (a > b) ? b : a; }

int EditDistance(char *str1, char *str2) {
  int size1 = strlen(str1);
  int size2 = strlen(str2);
  int i, j;
  for (i = 0; i <= size1; ++i) {
    for (j = 0; j <= size2; ++j) {
      if (i == 0)
        dp[i][j] = j;
      else if (j == 0)
        dp[i][j] = i;
      else if (str1[i - 1] == str2[j - 1])
        dp[i][j] = dp[i - 1][j - 1];
      else
        dp[i][j] = 1 + min(dp[i - 1][j], min(dp[i][j - 1], dp[i - 1][j - 1]));
    }
  }
  return dp[size1][size2];
}

int main() {
  char str1[101], str2[101];
  printf("Enter the first string: ");
  scanf("%s", str1);
  printf("Enter the second string: ");
  scanf("%s", str2);
  printf("Edit distance between %s and %s is %d\n", str1, str2,
         EditDistance(str1, str2));
}