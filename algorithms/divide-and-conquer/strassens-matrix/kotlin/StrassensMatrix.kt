fun strassensMatrix(arr: IntArray): IntArray {
    val n = arr[0]
    var sz = 1
    while (sz < n) sz *= 2

    fun makeMat(s: Int) = Array(s) { IntArray(s) }
    fun subM(m: Array<IntArray>, r: Int, c: Int, s: Int): Array<IntArray> {
        val res = makeMat(s)
        for (i in 0 until s) for (j in 0 until s) res[i][j] = m[r+i][c+j]
        return res
    }
    fun addM(a: Array<IntArray>, b: Array<IntArray>, s: Int): Array<IntArray> {
        val r = makeMat(s)
        for (i in 0 until s) for (j in 0 until s) r[i][j] = a[i][j] + b[i][j]
        return r
    }
    fun subM2(a: Array<IntArray>, b: Array<IntArray>, s: Int): Array<IntArray> {
        val r = makeMat(s)
        for (i in 0 until s) for (j in 0 until s) r[i][j] = a[i][j] - b[i][j]
        return r
    }

    fun mul(a: Array<IntArray>, b: Array<IntArray>, s: Int): Array<IntArray> {
        val c = makeMat(s)
        if (s == 1) { c[0][0] = a[0][0] * b[0][0]; return c }
        val h = s / 2
        val a11=subM(a,0,0,h); val a12=subM(a,0,h,h)
        val a21=subM(a,h,0,h); val a22=subM(a,h,h,h)
        val b11=subM(b,0,0,h); val b12=subM(b,0,h,h)
        val b21=subM(b,h,0,h); val b22=subM(b,h,h,h)
        val m1=mul(addM(a11,a22,h),addM(b11,b22,h),h)
        val m2=mul(addM(a21,a22,h),b11,h)
        val m3=mul(a11,subM2(b12,b22,h),h)
        val m4=mul(a22,subM2(b21,b11,h),h)
        val m5=mul(addM(a11,a12,h),b22,h)
        val m6=mul(subM2(a21,a11,h),addM(b11,b12,h),h)
        val m7=mul(subM2(a12,a22,h),addM(b21,b22,h),h)
        val c11=addM(subM2(addM(m1,m4,h),m5,h),m7,h)
        val c12=addM(m3,m5,h)
        val c21=addM(m2,m4,h)
        val c22=addM(subM2(addM(m1,m3,h),m2,h),m6,h)
        for (i in 0 until h) for (j in 0 until h) {
            c[i][j]=c11[i][j]; c[i][j+h]=c12[i][j]
            c[i+h][j]=c21[i][j]; c[i+h][j+h]=c22[i][j]
        }
        return c
    }

    val a = makeMat(sz); val b = makeMat(sz)
    for (i in 0 until n) for (j in 0 until n) {
        a[i][j] = arr[1+i*n+j]; b[i][j] = arr[1+n*n+i*n+j]
    }
    val result = mul(a, b, sz)
    return IntArray(n * n) { result[it / n][it % n] }
}
