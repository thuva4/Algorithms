import java.util.Random;

public class SimulatedAnnealing {

    public static int simulatedAnnealing(int[] arr) {
        if (arr.length == 0) return 0;
        if (arr.length == 1) return arr[0];

        int n = arr.length;
        Random rng = new Random(42);

        int current = 0;
        int best = 0;
        double temperature = 1000.0;
        double coolingRate = 0.995;
        double minTemp = 0.01;

        while (temperature > minTemp) {
            int neighbor = rng.nextInt(n);
            int delta = arr[neighbor] - arr[current];

            if (delta < 0) {
                current = neighbor;
            } else {
                double probability = Math.exp(-delta / temperature);
                if (rng.nextDouble() < probability) {
                    current = neighbor;
                }
            }

            if (arr[current] < arr[best]) {
                best = current;
            }

            temperature *= coolingRate;
        }

        return arr[best];
    }
}
