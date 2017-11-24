import java.util.Arrays;

/**
 * The knapsack problem or rucksack problem. Given a set of items, each with a weight and a value, 
 * determine the number of each item to include in a collection so that the total weight is less than 
 * or equal to a given limit and the total value is as large as possible.
 * 
 * @author Atom
 * @see <a href="https://en.wikipedia.org/wiki/Knapsack_problem">Knapsack problem</a>
 */
public class Knapsack {

	public static void maxValue(int maxCapacity, int[] weights, int[] values, int[][] v) {		
		for (int i = 1; i < maxCapacity + 1; i++) {
			for (int j = 1; j < weights.length + 1; j++) {
				if (weights[j - 1] > i) { 
					v[j][i] = v[j -1][i]; 
				} else {
					v[j][i] = Math.max(v[j - 1][i], v[j - 1][i - weights[j - 1]] + values[j - 1]);
				}
			}
		}
	}
	
	public static boolean[] includedItems(int[] weights, int[][] v) {
		boolean[] items = new boolean[weights.length];
		int w = v[0].length - 1;
		for (int i = weights.length; i > 0; i--) {
			if (v[i][w] == v[i - 1][w]) { items[i - 1] = false; }
			else {
				items[i - 1] = true;
				w -= weights[i - 1];
			}
		}
		return items;
	}
	
	public static void main(String[] args) { //main method.
		final int capacity = 8;
		final int[] values = {2, 5, 10, 14, 15};
		final int[] weights = {1, 3, 4, 5, 7};
		final int[][] v = new int[weights.length + 1][capacity + 1];
		System.out.println("Knapsack max weight = " + capacity);
		System.out.println("Number of distinct items = " + values.length);
		System.out.println("Values = " + Arrays.toString(values));
		System.out.println("Weights = " + Arrays.toString(weights));
		System.out.println();
		
		//getting maxVAlue 
		maxValue(capacity, weights, values, v);
		final int b = v[weights.length][capacity];
		System.out.println("v:");
		for (int i = 0; i < weights.length + 1; i++) { System.out.println(Arrays.toString(v[i])); }
		System.out.println();
		System.out.println("Maximum value = " + b);
		System.out.println("Items included: " + Arrays.toString(includedItems(weights, v)));	
	}

}
