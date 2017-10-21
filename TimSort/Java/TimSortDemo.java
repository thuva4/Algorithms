import java.util.Arrays;
import java.util.Random;

public class TimSortDemo {
    public static void main(String[] argv) {
        TimSort ts = new TimSort();
        
        int[] array = makeRandomArray(100);
        System.out.printf("Unsorted:\n%s\n", Arrays.toString(array));
        
        ts.sort(array);
        System.out.printf("Sorted:\n%s\n", Arrays.toString(array));
    }
    
    private static int[] makeRandomArray(int length) {
        Random random = new Random();
        int[] array = new int[length];
        
        for (int i = 0; i < length; i++) {
            array[i] = random.nextInt(length);
        }
        
        return array;
    }
}
