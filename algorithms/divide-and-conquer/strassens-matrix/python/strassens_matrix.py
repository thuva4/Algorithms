def strassens_matrix(arr: list[int]) -> list[int]:
    n = arr[0]
    a = [arr[1 + i * n + j] for i in range(n) for j in range(n)]
    b = [arr[1 + n * n + i * n + j] for i in range(n) for j in range(n)]

    def get(m, sz, r, c):
        return m[r * sz + c]

    def mat_add(a, b, sz):
        return [a[i] + b[i] for i in range(sz * sz)]

    def mat_sub(a, b, sz):
        return [a[i] - b[i] for i in range(sz * sz)]

    def mat_mul(a, b, sz):
        if sz == 1:
            return [a[0] * b[0]]

        half = sz // 2
        h2 = half * half

        def sub(m, r0, c0):
            res = [0] * h2
            for i in range(half):
                for j in range(half):
                    res[i * half + j] = m[(r0 + i) * sz + c0 + j]
            return res

        a11, a12 = sub(a, 0, 0), sub(a, 0, half)
        a21, a22 = sub(a, half, 0), sub(a, half, half)
        b11, b12 = sub(b, 0, 0), sub(b, 0, half)
        b21, b22 = sub(b, half, 0), sub(b, half, half)

        m1 = mat_mul(mat_add(a11, a22, half), mat_add(b11, b22, half), half)
        m2 = mat_mul(mat_add(a21, a22, half), b11, half)
        m3 = mat_mul(a11, mat_sub(b12, b22, half), half)
        m4 = mat_mul(a22, mat_sub(b21, b11, half), half)
        m5 = mat_mul(mat_add(a11, a12, half), b22, half)
        m6 = mat_mul(mat_sub(a21, a11, half), mat_add(b11, b12, half), half)
        m7 = mat_mul(mat_sub(a12, a22, half), mat_add(b21, b22, half), half)

        c11 = mat_add(mat_sub(mat_add(m1, m4, half), m5, half), m7, half)
        c12 = mat_add(m3, m5, half)
        c21 = mat_add(m2, m4, half)
        c22 = mat_add(mat_sub(mat_add(m1, m3, half), m2, half), m6, half)

        result = [0] * (sz * sz)
        for i in range(half):
            for j in range(half):
                result[i * sz + j] = c11[i * half + j]
                result[i * sz + half + j] = c12[i * half + j]
                result[(half + i) * sz + j] = c21[i * half + j]
                result[(half + i) * sz + half + j] = c22[i * half + j]

        return result

    # Pad to power of 2
    size = 1
    while size < n:
        size *= 2

    pa = [0] * (size * size)
    pb = [0] * (size * size)
    for i in range(n):
        for j in range(n):
            pa[i * size + j] = a[i * n + j]
            pb[i * size + j] = b[i * n + j]

    result = mat_mul(pa, pb, size)

    out = []
    for i in range(n):
        for j in range(n):
            out.append(result[i * size + j])

    return out
