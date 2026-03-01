public class SegmentTree {
    private int[] tree;
    private int n;

    public SegmentTree(int[] arr) {
        n = arr.length;
        tree = new int[4 * n];
        if (n > 0) build(arr, 0, 0, n - 1);
    }

    private void build(int[] arr, int node, int start, int end) {
        if (start == end) {
            tree[node] = arr[start];
        } else {
            int mid = (start + end) / 2;
            build(arr, 2 * node + 1, start, mid);
            build(arr, 2 * node + 2, mid + 1, end);
            tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
        }
    }

    public void update(int idx, int val) {
        update(0, 0, n - 1, idx, val);
    }

    private void update(int node, int start, int end, int idx, int val) {
        if (start == end) {
            tree[node] = val;
        } else {
            int mid = (start + end) / 2;
            if (idx <= mid) update(2 * node + 1, start, mid, idx, val);
            else update(2 * node + 2, mid + 1, end, idx, val);
            tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
        }
    }

    public int query(int l, int r) {
        return query(0, 0, n - 1, l, r);
    }

    public static int[] segmentTreeOperations(int[] array, java.util.List<java.util.Map<Object, Object>> queries) {
        SegmentTree st = new SegmentTree(array);
        java.util.List<Integer> answers = new java.util.ArrayList<>();
        for (java.util.Map<Object, Object> query : queries) {
            String type = String.valueOf(query.get("type"));
            if ("update".equals(type)) {
                int index = ((Number) query.get("index")).intValue();
                int value = ((Number) query.get("value")).intValue();
                st.update(index, value);
            } else if ("sum".equals(type)) {
                int left = ((Number) query.get("left")).intValue();
                int right = ((Number) query.get("right")).intValue();
                answers.add(st.query(left, right));
            }
        }
        int[] result = new int[answers.size()];
        for (int i = 0; i < answers.size(); i++) {
            result[i] = answers.get(i);
        }
        return result;
    }

    private int query(int node, int start, int end, int l, int r) {
        if (r < start || end < l) return 0;
        if (l <= start && end <= r) return tree[node];
        int mid = (start + end) / 2;
        return query(2 * node + 1, start, mid, l, r) +
               query(2 * node + 2, mid + 1, end, l, r);
    }

    public static void main(String[] args) {
        int[] arr = {1, 3, 5, 7, 9, 11};
        SegmentTree st = new SegmentTree(arr);
        System.out.println("Sum [1, 3]: " + st.query(1, 3));

        st.update(1, 10);
        System.out.println("After update, sum [1, 3]: " + st.query(1, 3));
    }
}
