import Foundation

class VEBTree {
    let u: Int
    var minVal: Int = -1
    var maxVal: Int = -1
    var sqrtU: Int = 0
    var cluster: [VEBTree]? = nil
    var summary: VEBTree? = nil

    init(_ u: Int) {
        self.u = u
        if u > 2 {
            sqrtU = Int(ceil(sqrt(Double(u))))
            cluster = (0..<sqrtU).map { _ in VEBTree(sqrtU) }
            summary = VEBTree(sqrtU)
        }
    }

    func high(_ x: Int) -> Int { return x / sqrtU }
    func low(_ x: Int) -> Int { return x % sqrtU }
    func idx(_ h: Int, _ l: Int) -> Int { return h * sqrtU + l }

    func insert(_ x: Int) {
        var x = x
        if minVal == -1 { minVal = x; maxVal = x; return }
        if x < minVal { let t = x; x = minVal; minVal = t }
        if u > 2 {
            let h = high(x), l = low(x)
            if cluster![h].minVal == -1 { summary!.insert(h) }
            cluster![h].insert(l)
        }
        if x > maxVal { maxVal = x }
    }

    func member(_ x: Int) -> Bool {
        if x == minVal || x == maxVal { return true }
        if u <= 2 { return false }
        return cluster![high(x)].member(low(x))
    }

    func successor(_ x: Int) -> Int {
        if u <= 2 {
            if x == 0 && maxVal == 1 { return 1 }
            return -1
        }
        if minVal != -1 && x < minVal { return minVal }
        let h = high(x), l = low(x)
        if cluster![h].minVal != -1 && l < cluster![h].maxVal {
            return idx(h, cluster![h].successor(l))
        }
        let sc = summary!.successor(h)
        if sc == -1 { return -1 }
        return idx(sc, cluster![sc].minVal)
    }
}

func vanEmdeBoasTree(_ data: [Int]) -> [Int] {
    let u = data[0], nOps = data[1]
    let veb = VEBTree(u)
    var results: [Int] = []
    var idx = 2
    for _ in 0..<nOps {
        let op = data[idx], val = data[idx + 1]
        idx += 2
        if op == 1 { veb.insert(val) }
        else if op == 2 { results.append(veb.member(val) ? 1 : 0) }
        else { results.append(veb.successor(val)) }
    }
    return results
}

print(vanEmdeBoasTree([16, 4, 1, 3, 1, 5, 2, 3, 2, 7]))
print(vanEmdeBoasTree([16, 6, 1, 1, 1, 4, 1, 9, 2, 4, 3, 4, 3, 9]))
