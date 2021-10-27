def sum_set(A: set, B: set) -> set:
    """
    A, B: set of numbers
    """
    l_a = [0] * (max(A) + 1)
    l_b = [0] * (max(B) + 1)
    for i in A:
        l_a[i] = 1
    for i in B:
        l_b[i] = 1
    l_a.reverse()
    l_b.reverse()
    poly_A = np.poly1d(np.array(l_a))
    poly_B = np.poly1d(np.array(l_b))

    l_res = list(np.polymul(poly_A, poly_B).c)
    l_res.reverse()
    
    res = set()

    for (i, x) in enumerate(l_res):
        if x == 0:
            continue
        res.add(i)

    return res

if __name__ == "__main__":
    A = {3,4,5}
    B = {2,3,4,5,6}
    print(sum_set(A, B))