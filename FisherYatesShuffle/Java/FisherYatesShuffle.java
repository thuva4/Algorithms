import java.util.Arrays;
import java.util.Random;

public class Main {

    public static void shuffle(int[] array) {
        Random random = new Random();
        for (int i = array.length - 1; i > 0; i--) {
            int index = random.nextInt(i);
            int tmp = array[index];
            array[index] = array[i];
            array[i] = tmp;
        }
    }

    public static void main(String[] args) {

        int [] array = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20};

        System.out.println("Before: " + Arrays.toString(array));
        shuffle(array);
        System.out.println("After:  " + Arrays.toString(array));

    }
}
