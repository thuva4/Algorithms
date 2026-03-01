import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class Sumset {
    public static int[] sumset(int[] setA, int[] setB) {
        List<Integer> values = new ArrayList<>();
        for (int a : setA) {
            for (int b : setB) {
                values.add(a + b);
            }
        }
        Collections.sort(values);
        int[] result = new int[values.size()];
        for (int i = 0; i < values.size(); i++) {
            result[i] = values.get(i);
        }
        return result;
    }
}
