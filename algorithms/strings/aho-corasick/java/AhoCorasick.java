import java.util.*;

public class AhoCorasick {
    private int[][] goTo;
    private int[] fail;
    private List<Integer>[] output;
    private String[] patterns;
    private int states;

    public AhoCorasick(String[] patterns) {
        this.patterns = patterns;
        int maxStates = 1;
        for (String p : patterns) maxStates += p.length();

        goTo = new int[maxStates][26];
        for (int[] row : goTo) Arrays.fill(row, -1);
        fail = new int[maxStates];
        output = new ArrayList[maxStates];
        for (int i = 0; i < maxStates; i++) output[i] = new ArrayList<>();

        states = 1;
        buildTrie();
        buildFailLinks();
    }

    private void buildTrie() {
        for (int i = 0; i < patterns.length; i++) {
            int cur = 0;
            for (char c : patterns[i].toCharArray()) {
                int ch = c - 'a';
                if (goTo[cur][ch] == -1) {
                    goTo[cur][ch] = states++;
                }
                cur = goTo[cur][ch];
            }
            output[cur].add(i);
        }
    }

    private void buildFailLinks() {
        Queue<Integer> queue = new LinkedList<>();
        for (int c = 0; c < 26; c++) {
            if (goTo[0][c] != -1) {
                fail[goTo[0][c]] = 0;
                queue.add(goTo[0][c]);
            } else {
                goTo[0][c] = 0;
            }
        }

        while (!queue.isEmpty()) {
            int u = queue.poll();
            for (int c = 0; c < 26; c++) {
                if (goTo[u][c] != -1) {
                    int v = goTo[u][c];
                    int f = fail[u];
                    while (f != 0 && goTo[f][c] == -1) f = fail[f];
                    fail[v] = (goTo[f][c] != -1 && goTo[f][c] != v) ? goTo[f][c] : 0;
                    output[v].addAll(output[fail[v]]);
                    queue.add(v);
                }
            }
        }
    }

    public List<int[]> search(String text) {
        List<int[]> results = new ArrayList<>();
        int cur = 0;
        for (int i = 0; i < text.length(); i++) {
            int c = text.charAt(i) - 'a';
            while (cur != 0 && goTo[cur][c] == -1) cur = fail[cur];
            if (goTo[cur][c] != -1) cur = goTo[cur][c];
            for (int idx : output[cur]) {
                results.add(new int[]{idx, i - patterns[idx].length() + 1});
            }
        }
        return results;
    }

    public static List<List<Object>> ahoCorasickSearch(String text, String[] patterns) {
        List<List<Object>> result = new ArrayList<>();
        for (int end = 0; end < text.length(); end++) {
            for (String pattern : patterns) {
                int length = pattern.length();
                int start = end - length + 1;
                if (start < 0) {
                    continue;
                }
                if (text.regionMatches(start, pattern, 0, length)) {
                    result.add(Arrays.asList(pattern, start));
                }
            }
        }
        return result;
    }

    public static void main(String[] args) {
        String[] patterns = {"he", "she", "his", "hers"};
        AhoCorasick ac = new AhoCorasick(patterns);
        List<int[]> results = ac.search("ahishers");
        for (int[] r : results) {
            System.out.println("Word \"" + patterns[r[0]] + "\" found at index " + r[1]);
        }
    }
}
