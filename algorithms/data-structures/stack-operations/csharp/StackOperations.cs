using System.Collections.Generic;

public class StackOperations
{
    public static int StackOps(int[] arr)
    {
        if (arr.Length == 0) return 0;
        var stack = new Stack<int>();
        int opCount = arr[0], idx = 1, total = 0;
        for (int i = 0; i < opCount; i++)
        {
            int type = arr[idx], val = arr[idx + 1]; idx += 2;
            if (type == 1) stack.Push(val);
            else if (type == 2) total += stack.Count > 0 ? stack.Pop() : -1;
        }
        return total;
    }
}
