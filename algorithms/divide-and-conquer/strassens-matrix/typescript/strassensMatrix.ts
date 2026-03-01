export function strassensMatrix(arr: number[]): number[] {
    const n = arr[0];
    let sz = 1;
    while (sz < n) sz *= 2;

    type Mat = number[][];
    const makeMat = (s: number): Mat => Array.from({ length: s }, () => new Array(s).fill(0));

    const subM = (m: Mat, r: number, c: number, s: number): Mat => {
        const res = makeMat(s);
        for (let i = 0; i < s; i++)
            for (let j = 0; j < s; j++)
                res[i][j] = m[r + i][c + j];
        return res;
    };

    const addM = (a: Mat, b: Mat, s: number): Mat => {
        const r = makeMat(s);
        for (let i = 0; i < s; i++)
            for (let j = 0; j < s; j++)
                r[i][j] = a[i][j] + b[i][j];
        return r;
    };

    const subM2 = (a: Mat, b: Mat, s: number): Mat => {
        const r = makeMat(s);
        for (let i = 0; i < s; i++)
            for (let j = 0; j < s; j++)
                r[i][j] = a[i][j] - b[i][j];
        return r;
    };

    const mul = (a: Mat, b: Mat, s: number): Mat => {
        const c = makeMat(s);
        if (s === 1) { c[0][0] = a[0][0] * b[0][0]; return c; }
        const h = s / 2;
        const a11 = subM(a,0,0,h), a12 = subM(a,0,h,h);
        const a21 = subM(a,h,0,h), a22 = subM(a,h,h,h);
        const b11 = subM(b,0,0,h), b12 = subM(b,0,h,h);
        const b21 = subM(b,h,0,h), b22 = subM(b,h,h,h);

        const m1 = mul(addM(a11,a22,h), addM(b11,b22,h), h);
        const m2 = mul(addM(a21,a22,h), b11, h);
        const m3 = mul(a11, subM2(b12,b22,h), h);
        const m4 = mul(a22, subM2(b21,b11,h), h);
        const m5 = mul(addM(a11,a12,h), b22, h);
        const m6 = mul(subM2(a21,a11,h), addM(b11,b12,h), h);
        const m7 = mul(subM2(a12,a22,h), addM(b21,b22,h), h);

        const c11 = addM(subM2(addM(m1,m4,h),m5,h),m7,h);
        const c12 = addM(m3,m5,h);
        const c21 = addM(m2,m4,h);
        const c22 = addM(subM2(addM(m1,m3,h),m2,h),m6,h);

        for (let i = 0; i < h; i++)
            for (let j = 0; j < h; j++) {
                c[i][j]=c11[i][j]; c[i][j+h]=c12[i][j];
                c[i+h][j]=c21[i][j]; c[i+h][j+h]=c22[i][j];
            }
        return c;
    };

    const a = makeMat(sz), b = makeMat(sz);
    for (let i = 0; i < n; i++)
        for (let j = 0; j < n; j++) {
            a[i][j] = arr[1 + i * n + j];
            b[i][j] = arr[1 + n * n + i * n + j];
        }

    const result = mul(a, b, sz);
    const out: number[] = [];
    for (let i = 0; i < n; i++)
        for (let j = 0; j < n; j++)
            out.push(result[i][j]);
    return out;
}
