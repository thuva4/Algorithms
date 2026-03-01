namespace Algorithms.Sorting.TreeSort
{
    public class TreeSort
    {
        private class Node
        {
            public int key;
            public Node left, right;

            public Node(int item)
            {
                key = item;
                left = right = null;
            }
        }

        public static void Sort(int[] arr)
        {
            Node root = null;
            for (int i = 0; i < arr.Length; i++)
            {
                root = Insert(root, arr[i]);
            }

            int index = 0;
            StoreSorted(root, arr, ref index);
        }

        private static Node Insert(Node root, int key)
        {
            if (root == null)
            {
                root = new Node(key);
                return root;
            }

            if (key < root.key)
                root.left = Insert(root.left, key);
            else
                root.right = Insert(root.right, key);

            return root;
        }

        private static void StoreSorted(Node root, int[] arr, ref int i)
        {
            if (root != null)
            {
                StoreSorted(root.left, arr, ref i);
                arr[i++] = root.key;
                StoreSorted(root.right, arr, ref i);
            }
        }
    }
}
