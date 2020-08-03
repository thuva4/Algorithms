import java.util.Arrays;
import java.util.Random;

public class FisherYatesShuffle {

	public static <T> void shuffle(T[] arr) {
		Random rnd = new Random();
		for (int i = arr.length - 1; i > 0; i--) {
			int randomPos = rnd.nextInt(i + 1);
			if (randomPos != i) {
				T tmp = arr[randomPos];
				arr[randomPos] = arr[i];
				arr[i] = tmp;				
			}
		}
	}
	
	public static void main(String[] args) {
		Integer[] i = { 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 };
		String[] s = { "mon", "Tue", "wed", "thu", "fri", "sat", "sun" };
		Character[] c = { 'A', 'B', 'C', 'D', 'E', 'F', 'G' };
		shuffle(i);
		shuffle(s);
		shuffle(c);
		System.out.println(Arrays.toString(i));
		System.out.println(Arrays.toString(s));
		System.out.println(Arrays.toString(c));
	}

}
