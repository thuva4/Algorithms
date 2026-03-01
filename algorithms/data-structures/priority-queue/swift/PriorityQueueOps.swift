func priorityQueueOps(_ arr: [Int]) -> Int {
    if arr.isEmpty { return 0 }
    var heap: [Int] = []
    let opCount = arr[0]
    var idx = 1
    var total = 0

    func siftUp(_ idx: Int) {
        var i = idx
        while i > 0 { let p = (i-1)/2; if heap[i] < heap[p] { heap.swapAt(i, p); i = p } else { break } }
    }
    func siftDown(_ idx: Int) {
        var i = idx
        while true { var s = i; let l = 2*i+1, r = 2*i+2
            if l < heap.count && heap[l] < heap[s] { s = l }
            if r < heap.count && heap[r] < heap[s] { s = r }
            if s != i { heap.swapAt(i, s); i = s } else { break } }
    }

    for _ in 0..<opCount {
        let type = arr[idx]; let v = arr[idx+1]; idx += 2
        if type == 1 { heap.append(v); siftUp(heap.count - 1) }
        else if type == 2 {
            if heap.isEmpty { continue }
            total += heap[0]; heap[0] = heap[heap.count-1]; heap.removeLast()
            if !heap.isEmpty { siftDown(0) }
        }
    }
    return total
}
