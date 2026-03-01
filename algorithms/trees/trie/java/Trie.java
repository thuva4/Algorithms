import java.util.HashMap;
import java.util.Map;

public class Trie {

    private static class TrieNode {
        Map<Character, TrieNode> children = new HashMap<>();
        boolean isEnd = false;
    }

    private static void insert(TrieNode root, int key) {
        TrieNode node = root;
        for (char ch : String.valueOf(key).toCharArray()) {
            node.children.putIfAbsent(ch, new TrieNode());
            node = node.children.get(ch);
        }
        node.isEnd = true;
    }

    private static boolean search(TrieNode root, int key) {
        TrieNode node = root;
        for (char ch : String.valueOf(key).toCharArray()) {
            if (!node.children.containsKey(ch)) {
                return false;
            }
            node = node.children.get(ch);
        }
        return node.isEnd;
    }

    public static int trieInsertSearch(int[] arr) {
        int n = arr.length;
        int mid = n / 2;
        TrieNode root = new TrieNode();

        for (int i = 0; i < mid; i++) {
            insert(root, arr[i]);
        }

        int count = 0;
        for (int i = mid; i < n; i++) {
            if (search(root, arr[i])) {
                count++;
            }
        }

        return count;
    }
}
