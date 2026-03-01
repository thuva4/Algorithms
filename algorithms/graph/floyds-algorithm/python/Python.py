#!/usr/bin/env python3

'''
 Implementation of Optimal Floyd Algorithm for finding shortest paths in a weighted graph with positive or negative edge weights (but with no negative cycles).

 The values can be inserted using a matrix ( array of arrays of ints )
'''
inf = 10**10

def floyd(matrix):
    matrix_length = len(matrix)
    for k in range(matrix_length):
        for i in range(matrix_length):
            for j in range(matrix_length):
                # Negative Weight Cycles are not allowed in Floyd Algorithm
                if (i == j ) and (matrix[i][j] < 0 ):
                        return -1
                if matrix[i][k] + matrix[k][j] < matrix[i][j]:
                    matrix[i][j] = matrix[i][k] + matrix[k][j]
    return matrix


def run_test():
    matrix = [
        [0,     inf,    -2,     inf],
        [4,     0,       3,     inf],
        [inf,   inf,     0,     2],
        [inf,   -1,      inf,   0],
    ]

    ans_matrix = [
        [0,     -1,     -2,     0],
        [4,      0,      2,     4],
        [5,      1,      0,     2],
        [3,     -1,      1,     0],
    ]
    ans = floyd(matrix)
    if (ans == ans_matrix):
        return True 
    else:
        return False
