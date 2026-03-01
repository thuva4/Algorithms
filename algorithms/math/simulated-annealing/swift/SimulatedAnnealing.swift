import Foundation

func simulatedAnnealing(_ arr: [Int]) -> Int {
    if arr.isEmpty { return 0 }
    if arr.count == 1 { return arr[0] }

    let n = arr.count
    var state: UInt64 = 42

    func nextRand() -> Double {
        state = state &* 6364136223846793005 &+ 1442695040888963407
        return Double(state >> 33) / Double(1 << 31)
    }

    var current = 0
    var best = 0
    var temperature = 1000.0
    let coolingRate = 0.995
    let minTemp = 0.01

    while temperature > minTemp {
        let neighbor = Int(nextRand() * Double(n)) % n
        let delta = arr[neighbor] - arr[current]

        if delta < 0 {
            current = neighbor
        } else {
            let probability = exp(-Double(delta) / temperature)
            if nextRand() < probability {
                current = neighbor
            }
        }

        if arr[current] < arr[best] {
            best = current
        }

        temperature *= coolingRate
    }

    return arr[best]
}
