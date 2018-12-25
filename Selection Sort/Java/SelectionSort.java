public class SelectionSort {

	public static void selectionSort(int[] arr) {
		int k, temp, min;
		int n = arr.length;

		for (int i = 0; i < n - 1; i++) {
			min = i;
			
			for (k = i + 1; k < n; k++) {
				if (arr[min] > arr[k])
					min = k;
			}
			
			if (i != min) {
				temp = arr[i];
				arr[i] = arr[min];
				arr[min] = temp;
			}
		}
	}

	public static void main(String[] args) {
		Scanner scanner = new Scanner(System.in);
		
		System.out.print("Enter the size: ");
		
		int size = Integer.parseInt(scanner.next());
		
		int[] arr = new int[size];
		
		for(int i=0;i<size;i++) {
			System.out.print("Enter the element " + (i+1) + ": ");
			
			arr[i] = Integer.parseInt(scanner.next());
		}
		
		selectionSort(arr);
		
		System.out.println("Array after sort:");
		
		System.out.print("[ ");
		
		for(int i=0;i<size;i++)
			System.out.print(arr[i] + ((i == size-1) ? "" : ", "));
		
		System.out.println(" ]");
		
		scanner.close();
	}
}
