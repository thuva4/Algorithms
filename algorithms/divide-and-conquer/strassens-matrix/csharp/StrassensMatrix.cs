using System;

public class StrassensMatrix
{
    public static int[] Compute(int[] arr)
    {
        int n = arr[0];
        int sz = 1;
        while (sz < n) sz *= 2;

        int[,] a = new int[sz, sz], b = new int[sz, sz];
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++)
            {
                a[i, j] = arr[1 + i * n + j];
                b[i, j] = arr[1 + n * n + i * n + j];
            }

        int[,] result = Multiply(a, b, sz);
        int[] output = new int[n * n];
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++)
                output[i * n + j] = result[i, j];
        return output;
    }

    private static int[,] Multiply(int[,] a, int[,] b, int n)
    {
        int[,] c = new int[n, n];
        if (n == 1) { c[0, 0] = a[0, 0] * b[0, 0]; return c; }
        int h = n / 2;
        var a11 = Sub(a,0,0,h); var a12 = Sub(a,0,h,h);
        var a21 = Sub(a,h,0,h); var a22 = Sub(a,h,h,h);
        var b11 = Sub(b,0,0,h); var b12 = Sub(b,0,h,h);
        var b21 = Sub(b,h,0,h); var b22 = Sub(b,h,h,h);

        var m1 = Multiply(Add(a11,a22,h), Add(b11,b22,h), h);
        var m2 = Multiply(Add(a21,a22,h), b11, h);
        var m3 = Multiply(a11, Sub2(b12,b22,h), h);
        var m4 = Multiply(a22, Sub2(b21,b11,h), h);
        var m5 = Multiply(Add(a11,a12,h), b22, h);
        var m6 = Multiply(Sub2(a21,a11,h), Add(b11,b12,h), h);
        var m7 = Multiply(Sub2(a12,a22,h), Add(b21,b22,h), h);

        var c11 = Add(Sub2(Add(m1,m4,h),m5,h),m7,h);
        var c12 = Add(m3,m5,h);
        var c21 = Add(m2,m4,h);
        var c22 = Add(Sub2(Add(m1,m3,h),m2,h),m6,h);

        for (int i = 0; i < h; i++)
            for (int j = 0; j < h; j++)
            {
                c[i,j]=c11[i,j]; c[i,j+h]=c12[i,j];
                c[i+h,j]=c21[i,j]; c[i+h,j+h]=c22[i,j];
            }
        return c;
    }

    private static int[,] Sub(int[,] m, int r, int c, int s)
    {
        int[,] res = new int[s, s];
        for (int i = 0; i < s; i++)
            for (int j = 0; j < s; j++)
                res[i, j] = m[r + i, c + j];
        return res;
    }

    private static int[,] Add(int[,] a, int[,] b, int s)
    {
        int[,] r = new int[s, s];
        for (int i = 0; i < s; i++)
            for (int j = 0; j < s; j++)
                r[i, j] = a[i, j] + b[i, j];
        return r;
    }

    private static int[,] Sub2(int[,] a, int[,] b, int s)
    {
        int[,] r = new int[s, s];
        for (int i = 0; i < s; i++)
            for (int j = 0; j < s; j++)
                r[i, j] = a[i, j] - b[i, j];
        return r;
    }
}
