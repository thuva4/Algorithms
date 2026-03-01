using System.Collections.Generic;

public class ReverseLinkedList
{
    private class ListNode
    {
        public int Value;
        public ListNode Next;

        public ListNode(int value)
        {
            Value = value;
        }
    }

    private static ListNode BuildList(int[] arr)
    {
        if (arr.Length == 0) return null;
        ListNode head = new ListNode(arr[0]);
        ListNode current = head;
        for (int i = 1; i < arr.Length; i++)
        {
            current.Next = new ListNode(arr[i]);
            current = current.Next;
        }
        return head;
    }

    private static int[] ToArray(ListNode head)
    {
        List<int> result = new List<int>();
        ListNode current = head;
        while (current != null)
        {
            result.Add(current.Value);
            current = current.Next;
        }
        return result.ToArray();
    }

    public static int[] Reverse(int[] arr)
    {
        ListNode head = BuildList(arr);

        ListNode prev = null;
        ListNode current = head;
        while (current != null)
        {
            ListNode next = current.Next;
            current.Next = prev;
            prev = current;
            current = next;
        }

        return ToArray(prev);
    }
}
