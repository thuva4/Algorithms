using System;

public class XorSwap
{
    void Swap( ref int a, ref int b)
	{
	   a ^= b;
       b ^= a;
       a ^= b;
	}

	void Main()
    {
        int a = 5;
		int b = 10;
		XorSwap(ref a, ref b);
    }
}


