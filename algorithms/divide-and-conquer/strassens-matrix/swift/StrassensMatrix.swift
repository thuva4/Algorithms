func strassensMatrix(_ arr: [Int]) -> [Int] {
    let n = arr[0]
    var sz = 1
    while sz < n { sz *= 2 }

    typealias Mat = [[Int]]
    func makeMat(_ s: Int) -> Mat { Array(repeating: Array(repeating: 0, count: s), count: s) }
    func subM(_ m: Mat, _ r: Int, _ c: Int, _ s: Int) -> Mat {
        var res = makeMat(s)
        for i in 0..<s { for j in 0..<s { res[i][j] = m[r+i][c+j] } }
        return res
    }
    func addM(_ a: Mat, _ b: Mat, _ s: Int) -> Mat {
        var r = makeMat(s)
        for i in 0..<s { for j in 0..<s { r[i][j] = a[i][j] + b[i][j] } }
        return r
    }
    func subM2(_ a: Mat, _ b: Mat, _ s: Int) -> Mat {
        var r = makeMat(s)
        for i in 0..<s { for j in 0..<s { r[i][j] = a[i][j] - b[i][j] } }
        return r
    }
    func mul(_ a: Mat, _ b: Mat, _ s: Int) -> Mat {
        var c = makeMat(s)
        if s == 1 { c[0][0] = a[0][0] * b[0][0]; return c }
        let h = s / 2
        let a11=subM(a,0,0,h),a12=subM(a,0,h,h),a21=subM(a,h,0,h),a22=subM(a,h,h,h)
        let b11=subM(b,0,0,h),b12=subM(b,0,h,h),b21=subM(b,h,0,h),b22=subM(b,h,h,h)
        let m1=mul(addM(a11,a22,h),addM(b11,b22,h),h)
        let m2=mul(addM(a21,a22,h),b11,h)
        let m3=mul(a11,subM2(b12,b22,h),h)
        let m4=mul(a22,subM2(b21,b11,h),h)
        let m5=mul(addM(a11,a12,h),b22,h)
        let m6=mul(subM2(a21,a11,h),addM(b11,b12,h),h)
        let m7=mul(subM2(a12,a22,h),addM(b21,b22,h),h)
        let c11=addM(subM2(addM(m1,m4,h),m5,h),m7,h)
        let c12=addM(m3,m5,h),c21=addM(m2,m4,h)
        let c22=addM(subM2(addM(m1,m3,h),m2,h),m6,h)
        for i in 0..<h { for j in 0..<h {
            c[i][j]=c11[i][j]; c[i][j+h]=c12[i][j]
            c[i+h][j]=c21[i][j]; c[i+h][j+h]=c22[i][j]
        }}
        return c
    }

    var a = makeMat(sz), b = makeMat(sz)
    for i in 0..<n { for j in 0..<n {
        a[i][j] = arr[1+i*n+j]; b[i][j] = arr[1+n*n+i*n+j]
    }}
    let result = mul(a, b, sz)
    var out = [Int]()
    for i in 0..<n { for j in 0..<n { out.append(result[i][j]) } }
    return out
}
