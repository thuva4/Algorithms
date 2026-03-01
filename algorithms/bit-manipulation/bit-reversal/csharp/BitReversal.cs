public class BitReversal
{
    public static long Reverse(long n)
    {
        uint val = (uint)n;
        uint result = 0;
        for (int i = 0; i < 32; i++)
        {
            result = (result << 1) | (val & 1);
            val >>= 1;
        }
        return (long)result;
    }
}
