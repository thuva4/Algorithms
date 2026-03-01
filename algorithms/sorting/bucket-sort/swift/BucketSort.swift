/**
 * Bucket Sort implementation.
 * Divides the input into several buckets, each of which is then sorted individually.
 */
public class BucketSort {
    public static func sort(_ arr: [Int]) -> [Int] {
        guard arr.count > 1 else {
            return arr
        }

        let n = arr.count
        guard let minVal = arr.min(), let maxVal = arr.max() else {
            return arr
        }

        if minVal == maxVal {
            return arr
        }

        // Initialize buckets
        var buckets: [[Int]] = Array(repeating: [], count: n)
        let range = Double(maxVal - minVal)

        // Distribute elements into buckets
        for x in arr {
            let index = Int(Double(x - minVal) * Double(n - 1) / range)
            buckets[index].append(x)
        }

        // Sort each bucket and merge
        var result: [Int] = []
        result.reserveCapacity(n)
        for i in 0..<n {
            if !buckets[i].isEmpty {
                let sortedBucket = buckets[i].sorted()
                result.append(contentsOf: sortedBucket)
            }
        }

        return result
    }
}
