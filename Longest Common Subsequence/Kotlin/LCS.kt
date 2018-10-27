// Returns length of LCS for X[0..m-1], Y[0..n-1]
fun lcs(X: String, Y: String) {
    val m = X.length
    val n = Y.length
    val arr = Array(m + 1) { IntArray(n + 1) }

    // Following steps build L[m+1][n+1] in bottom up fashion. Note
    // that L[i][j] contains length of LCS of X[0..i-1] and Y[0..j-1]
    for (i in 0..m) {
        for (j in 0..n) {
            if (i == 0 || j == 0)
                arr[i][j] = 0
            else if (X[i - 1] == Y[j - 1])
                arr[i][j] = arr[i - 1][j - 1] + 1
            else
                arr[i][j] = Math.max(arr[i - 1][j], arr[i][j - 1])
        }
    }

    // Following code is used to print LCS
    var index = arr[m][n]
    val temp = index

    // Create a character array to store the lcs string
    val lcs = CharArray(index + 1)
    lcs[index] = '\u0000' // Set the terminating character

    // Start from the right-most-bottom-most corner and
    // one by one store characters in lcs[]
    var i = m
    var j = n
    while (i > 0 && j > 0) {
        // If current character in X[] and Y are same, then
        // current character is part of LCS
        when {
            X[i - 1] == Y[j - 1] -> {
                // Put current character in result
                lcs[index - 1] = X[i - 1]

                // reduce values of i, j and index
                i--
                j--
                index--
            }
            arr[i - 1][j] > arr[i][j - 1] -> i--
            else -> j--
        }// If not same, then find the larger of two and
        // go in the direction of larger value
    }

    // Print the lcs
    print("LCS of $X and $Y is ")
    for (k in 0..temp)
        print(lcs[k])
}