export function knapsack(weights, values, capacity) {
  const dp = new Array(capacity + 1).fill(0);

  for (let i = 0; i < weights.length; i += 1) {
    for (let c = capacity; c >= weights[i]; c -= 1) {
      dp[c] = Math.max(dp[c], dp[c - weights[i]] + values[i]);
    }
  }

  return dp[capacity];
}
