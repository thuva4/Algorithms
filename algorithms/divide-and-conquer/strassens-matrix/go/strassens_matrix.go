package strassensmatrix

type mat = [][]int

func makeMat(n int) mat {
	m := make(mat, n)
	for i := range m {
		m[i] = make([]int, n)
	}
	return m
}

func subMat(m mat, r, c, sz int) mat {
	res := makeMat(sz)
	for i := 0; i < sz; i++ {
		for j := 0; j < sz; j++ {
			res[i][j] = m[r+i][c+j]
		}
	}
	return res
}

func addMat(a, b mat, sz int) mat {
	r := makeMat(sz)
	for i := 0; i < sz; i++ {
		for j := 0; j < sz; j++ {
			r[i][j] = a[i][j] + b[i][j]
		}
	}
	return r
}

func subMat2(a, b mat, sz int) mat {
	r := makeMat(sz)
	for i := 0; i < sz; i++ {
		for j := 0; j < sz; j++ {
			r[i][j] = a[i][j] - b[i][j]
		}
	}
	return r
}

func multiply(a, b mat, n int) mat {
	c := makeMat(n)
	if n == 1 {
		c[0][0] = a[0][0] * b[0][0]
		return c
	}
	h := n / 2
	a11, a12 := subMat(a, 0, 0, h), subMat(a, 0, h, h)
	a21, a22 := subMat(a, h, 0, h), subMat(a, h, h, h)
	b11, b12 := subMat(b, 0, 0, h), subMat(b, 0, h, h)
	b21, b22 := subMat(b, h, 0, h), subMat(b, h, h, h)

	m1 := multiply(addMat(a11, a22, h), addMat(b11, b22, h), h)
	m2 := multiply(addMat(a21, a22, h), b11, h)
	m3 := multiply(a11, subMat2(b12, b22, h), h)
	m4 := multiply(a22, subMat2(b21, b11, h), h)
	m5 := multiply(addMat(a11, a12, h), b22, h)
	m6 := multiply(subMat2(a21, a11, h), addMat(b11, b12, h), h)
	m7 := multiply(subMat2(a12, a22, h), addMat(b21, b22, h), h)

	c11 := addMat(subMat2(addMat(m1, m4, h), m5, h), m7, h)
	c12 := addMat(m3, m5, h)
	c21 := addMat(m2, m4, h)
	c22 := addMat(subMat2(addMat(m1, m3, h), m2, h), m6, h)

	for i := 0; i < h; i++ {
		for j := 0; j < h; j++ {
			c[i][j] = c11[i][j]
			c[i][j+h] = c12[i][j]
			c[i+h][j] = c21[i][j]
			c[i+h][j+h] = c22[i][j]
		}
	}
	return c
}

func StrassensMatrix(arr []int) []int {
	n := arr[0]
	sz := 1
	for sz < n {
		sz *= 2
	}
	a, b := makeMat(sz), makeMat(sz)
	for i := 0; i < n; i++ {
		for j := 0; j < n; j++ {
			a[i][j] = arr[1+i*n+j]
			b[i][j] = arr[1+n*n+i*n+j]
		}
	}
	result := multiply(a, b, sz)
	out := make([]int, n*n)
	for i := 0; i < n; i++ {
		for j := 0; j < n; j++ {
			out[i*n+j] = result[i][j]
		}
	}
	return out
}
