import java.util.Random;

public class GeneticAlgorithm {

    public static int geneticAlgorithm(int[] arr, int seed) {
        if (arr.length == 0) return 0;
        if (arr.length == 1) return arr[0];

        int n = arr.length;
        Random rng = new Random(seed);
        int popSize = Math.min(20, n);
        int generations = 100;
        double mutationRate = 0.1;

        int[] population = new int[popSize];
        for (int i = 0; i < popSize; i++) {
            population[i] = rng.nextInt(n);
        }

        int bestIdx = population[0];
        for (int idx : population) {
            if (arr[idx] < arr[bestIdx]) bestIdx = idx;
        }

        for (int g = 0; g < generations; g++) {
            int[] newPop = new int[popSize];
            for (int i = 0; i < popSize; i++) {
                int a = population[rng.nextInt(popSize)];
                int b = population[rng.nextInt(popSize)];
                newPop[i] = arr[a] <= arr[b] ? a : b;
            }

            int[] offspring = new int[popSize];
            for (int i = 0; i < popSize - 1; i += 2) {
                if (rng.nextDouble() < 0.7) {
                    offspring[i] = newPop[i];
                    offspring[i + 1] = newPop[i + 1];
                } else {
                    offspring[i] = newPop[i + 1];
                    offspring[i + 1] = newPop[i];
                }
            }
            if (popSize % 2 != 0) {
                offspring[popSize - 1] = newPop[popSize - 1];
            }

            for (int i = 0; i < popSize; i++) {
                if (rng.nextDouble() < mutationRate) {
                    offspring[i] = rng.nextInt(n);
                }
            }

            population = offspring;

            for (int idx : population) {
                if (arr[idx] < arr[bestIdx]) bestIdx = idx;
            }
        }

        return arr[bestIdx];
    }
}
