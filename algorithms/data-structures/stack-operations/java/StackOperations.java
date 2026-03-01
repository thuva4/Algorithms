import java.util.ArrayList;
import java.util.List;

public class StackOperations {

    public static int stackOps(int[] arr) {
        if (arr.length == 0) return 0;
        List<Integer> stack = new ArrayList<>();
        int opCount = arr[0], idx = 1, total = 0;
        for (int i = 0; i < opCount; i++) {
            int type = arr[idx], val = arr[idx + 1];
            idx += 2;
            if (type == 1) {
                stack.add(val);
            } else if (type == 2) {
                if (!stack.isEmpty()) total += stack.remove(stack.size() - 1);
                else total += -1;
            }
        }
        return total;
    }
}
