using System;

public class CycleDetectionFloyd
{
    public static int DetectCycle(int[] arr)
    {
        int n = arr.Length;
        if (n == 0)
        {
            return -1;
        }

        int NextPos(int pos)
        {
            if (pos < 0 || pos >= n || arr[pos] == -1)
            {
                return -1;
            }
            return arr[pos];
        }

        int tortoise = 0;
        int hare = 0;

        // Phase 1: Detect cycle
        while (true)
        {
            tortoise = NextPos(tortoise);
            if (tortoise == -1) return -1;

            hare = NextPos(hare);
            if (hare == -1) return -1;
            hare = NextPos(hare);
            if (hare == -1) return -1;

            if (tortoise == hare) break;
        }

        // Phase 2: Find cycle start
        int pointer1 = 0;
        int pointer2 = tortoise;
        while (pointer1 != pointer2)
        {
            pointer1 = arr[pointer1];
            pointer2 = arr[pointer2];
        }

        return pointer1;
    }
}
