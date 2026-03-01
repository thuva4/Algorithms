import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class Permutations {
    public static List<List<Integer>> permutations(List<Integer> arr) {
        List<List<Integer>> result = new ArrayList<>();
        if (arr.isEmpty()) {
            result.add(new ArrayList<>());
            return result;
        }
        backtrack(new ArrayList<>(), new ArrayList<>(arr), result);
        Collections.sort(result, (a, b) -> {
            for (int i = 0; i < a.size(); i++) {
                if (!a.get(i).equals(b.get(i))) {
                    return a.get(i) - b.get(i);
                }
            }
            return 0;
        });
        return result;
    }

    private static void backtrack(List<Integer> current, List<Integer> remaining,
                                   List<List<Integer>> result) {
        if (remaining.isEmpty()) {
            result.add(new ArrayList<>(current));
            return;
        }
        for (int i = 0; i < remaining.size(); i++) {
            int elem = remaining.get(i);
            current.add(elem);
            remaining.remove(i);
            backtrack(current, remaining, result);
            remaining.add(i, elem);
            current.remove(current.size() - 1);
        }
    }

    public static void main(String[] args) {
        List<Integer> arr = List.of(1, 2, 3);
        List<List<Integer>> result = permutations(new ArrayList<>(arr));
        for (List<Integer> perm : result) {
            System.out.println(perm);
        }
    }
}
