/**
 * Cycle Sort implementation.
 * An in-place, unstable sorting algorithm that is optimal in terms of
 * the number of writes to the original array.
 */
public class CycleSort {
    public static func sort(_ arr: [Int]) -> [Int] {
        var result = arr
        let n = result.count
        if n < 2 {
            return result
        }

        for cycleStart in 0..<(n - 1) {
            var item = result[cycleStart]

            var pos = cycleStart
            for i in (cycleStart + 1)..<n {
                if result[i] < item {
                    pos += 1
                }
            }

            if pos == cycleStart {
                continue
            }

            while item == result[pos] {
                pos += 1
            }

            if pos != cycleStart {
                let temp = item
                item = result[pos]
                result[pos] = temp
            }

            while pos != cycleStart {
                pos = cycleStart
                for i in (cycleStart + 1)..<n {
                    if result[i] < item {
                        pos += 1
                    }
                }

                while item == result[pos] {
                    pos += 1
                }

                if item != result[pos] {
                    let temp = item
                    item = result[pos]
                    result[pos] = temp
                }
            }
        }

        return result
    }
}
