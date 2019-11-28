def knapsack(val, w, capacity, n):
    k = [[0 for x in range(capacity+1)] for x in range(n+1)]

    for i in range(capacity+1):
        k[0][i] = 0
    for i in range(n):
        i = i + 1
        k[i][0] = 0
        for j in range(capacity):
            j = j + 1
            if w[i] <= j:
                if val[i] + k[i-1][j-w[i]] > k[i-1][j]:
                    k[i][j] = val[i] + k[i-1][j-w[i]]
                else:
                    k[i][j] = k[i-1][j]
            else:
                k[i][j] = k[i-1][j]
    return k[n][capacity]


if __name__=='__main__':
    val = [0, 60, 100, 120]
    w = [0, 10, 20, 30]
    capacity = 50
    n = len(val) - 1
    print(knapsack(val, w, capacity, n))
