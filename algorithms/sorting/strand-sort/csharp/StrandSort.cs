using System;
using System.Collections.Generic;

namespace Algorithms.Sorting.StrandSort
{
    public class StrandSort
    {
        public static void Sort(int[] arr)
        {
            if (arr == null || arr.Length <= 1) return;

            LinkedList<int> list = new LinkedList<int>(arr);
            LinkedList<int> sorted = new LinkedList<int>();

            while (list.Count > 0)
            {
                LinkedList<int> strand = new LinkedList<int>();
                strand.AddLast(list.First.Value);
                list.RemoveFirst();

                LinkedListNode<int> current = list.First;
                while (current != null)
                {
                    LinkedListNode<int> next = current.Next;
                    if (current.Value >= strand.Last.Value)
                    {
                        strand.AddLast(current.Value);
                        list.Remove(current);
                    }
                    current = next;
                }

                Merge(sorted, strand);
            }

            list = sorted;
            int i = 0;
            foreach (int val in sorted)
            {
                arr[i++] = val;
            }
        }

        private static void Merge(LinkedList<int> sorted, LinkedList<int> strand)
        {
            if (sorted.Count == 0)
            {
                foreach (var item in strand) sorted.AddLast(item);
                return;
            }

            LinkedListNode<int> sortedNode = sorted.First;
            LinkedListNode<int> strandNode = strand.First;

            while (sortedNode != null && strandNode != null)
            {
                if (strandNode.Value < sortedNode.Value)
                {
                    sorted.AddBefore(sortedNode, strandNode.Value);
                    strandNode = strandNode.Next;
                }
                else
                {
                    sortedNode = sortedNode.Next;
                }
            }

            while (strandNode != null)
            {
                sorted.AddLast(strandNode.Value);
                strandNode = strandNode.Next;
            }
        }
    }
}
