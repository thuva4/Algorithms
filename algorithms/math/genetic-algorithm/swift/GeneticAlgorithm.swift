import Foundation

func geneticAlgorithm(_ arr: [Int], _ seed: Int) -> Int {
    if arr.isEmpty { return 0 }
    if arr.count == 1 { return arr[0] }

    let n = arr.count
    var state: UInt64 = UInt64(seed)

    func nextRand() -> Double {
        state = state &* 6364136223846793005 &+ 1442695040888963407
        return Double(state >> 33) / Double(1 << 31)
    }
    func nextInt(_ max: Int) -> Int {
        return Int(nextRand() * Double(max)) % max
    }

    let popSize = min(20, n)
    let generations = 100
    let mutationRate = 0.1

    var population = (0..<popSize).map { _ in nextInt(n) }

    var bestIdx = population[0]
    for idx in population {
        if arr[idx] < arr[bestIdx] { bestIdx = idx }
    }

    for _ in 0..<generations {
        var newPop = [Int]()
        for _ in 0..<popSize {
            let a = population[nextInt(popSize)]
            let b = population[nextInt(popSize)]
            newPop.append(arr[a] <= arr[b] ? a : b)
        }

        var offspring = [Int](repeating: 0, count: popSize)
        var i = 0
        while i + 1 < popSize {
            if nextRand() < 0.7 {
                offspring[i] = newPop[i]
                offspring[i + 1] = newPop[i + 1]
            } else {
                offspring[i] = newPop[i + 1]
                offspring[i + 1] = newPop[i]
            }
            i += 2
        }
        if popSize % 2 != 0 {
            offspring[popSize - 1] = newPop[popSize - 1]
        }

        for j in 0..<popSize {
            if nextRand() < mutationRate {
                offspring[j] = nextInt(n)
            }
        }

        population = offspring

        for idx in population {
            if arr[idx] < arr[bestIdx] { bestIdx = idx }
        }
    }

    return arr[bestIdx]
}
