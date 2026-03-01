fun fractionalKnapsack(arr: IntArray): Int {
    val capacity = arr[0]; val n = arr[1]
    val items = mutableListOf<Pair<Int, Int>>()
    var idx = 2
    for (i in 0 until n) { items.add(Pair(arr[idx], arr[idx + 1])); idx += 2 }
    items.sortByDescending { it.first.toDouble() / it.second }

    var totalValue = 0.0; var remaining = capacity
    for ((value, weight) in items) {
        if (remaining <= 0) break
        if (weight <= remaining) { totalValue += value; remaining -= weight }
        else { totalValue += value.toDouble() * remaining / weight; remaining = 0 }
    }
    return (totalValue * 100).toInt()
}
