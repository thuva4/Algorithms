type Mat = Vec<Vec<i32>>;

fn make_mat(n: usize) -> Mat {
    vec![vec![0i32; n]; n]
}

fn sub_mat(m: &Mat, r: usize, c: usize, sz: usize) -> Mat {
    let mut res = make_mat(sz);
    for i in 0..sz { for j in 0..sz { res[i][j] = m[r+i][c+j]; } }
    res
}

fn add_mat(a: &Mat, b: &Mat, sz: usize) -> Mat {
    let mut r = make_mat(sz);
    for i in 0..sz { for j in 0..sz { r[i][j] = a[i][j] + b[i][j]; } }
    r
}

fn sub_mat2(a: &Mat, b: &Mat, sz: usize) -> Mat {
    let mut r = make_mat(sz);
    for i in 0..sz { for j in 0..sz { r[i][j] = a[i][j] - b[i][j]; } }
    r
}

fn multiply(a: &Mat, b: &Mat, n: usize) -> Mat {
    let mut c = make_mat(n);
    if n == 1 { c[0][0] = a[0][0] * b[0][0]; return c; }
    let h = n / 2;
    let (a11, a12) = (sub_mat(a,0,0,h), sub_mat(a,0,h,h));
    let (a21, a22) = (sub_mat(a,h,0,h), sub_mat(a,h,h,h));
    let (b11, b12) = (sub_mat(b,0,0,h), sub_mat(b,0,h,h));
    let (b21, b22) = (sub_mat(b,h,0,h), sub_mat(b,h,h,h));

    let m1 = multiply(&add_mat(&a11,&a22,h), &add_mat(&b11,&b22,h), h);
    let m2 = multiply(&add_mat(&a21,&a22,h), &b11, h);
    let m3 = multiply(&a11, &sub_mat2(&b12,&b22,h), h);
    let m4 = multiply(&a22, &sub_mat2(&b21,&b11,h), h);
    let m5 = multiply(&add_mat(&a11,&a12,h), &b22, h);
    let m6 = multiply(&sub_mat2(&a21,&a11,h), &add_mat(&b11,&b12,h), h);
    let m7 = multiply(&sub_mat2(&a12,&a22,h), &add_mat(&b21,&b22,h), h);

    let c11 = add_mat(&sub_mat2(&add_mat(&m1,&m4,h),&m5,h),&m7,h);
    let c12 = add_mat(&m3,&m5,h);
    let c21 = add_mat(&m2,&m4,h);
    let c22 = add_mat(&sub_mat2(&add_mat(&m1,&m3,h),&m2,h),&m6,h);

    for i in 0..h { for j in 0..h {
        c[i][j]=c11[i][j]; c[i][j+h]=c12[i][j];
        c[i+h][j]=c21[i][j]; c[i+h][j+h]=c22[i][j];
    }}
    c
}

pub fn strassens_matrix(arr: &[i32]) -> Vec<i32> {
    let n = arr[0] as usize;
    let mut sz = 1;
    while sz < n { sz *= 2; }
    let mut a = make_mat(sz);
    let mut b = make_mat(sz);
    for i in 0..n { for j in 0..n {
        a[i][j] = arr[1+i*n+j];
        b[i][j] = arr[1+n*n+i*n+j];
    }}
    let result = multiply(&a, &b, sz);
    let mut out = Vec::new();
    for i in 0..n { for j in 0..n { out.push(result[i][j]); } }
    out
}
