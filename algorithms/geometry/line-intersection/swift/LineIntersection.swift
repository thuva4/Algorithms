func lineIntersection(_ arr: [Int]) -> Int {
    let (x1, y1, x2, y2) = (arr[0], arr[1], arr[2], arr[3])
    let (x3, y3, x4, y4) = (arr[4], arr[5], arr[6], arr[7])

    func orientation(_ px: Int, _ py: Int, _ qx: Int, _ qy: Int, _ rx: Int, _ ry: Int) -> Int {
        let val2 = (qy - py) * (rx - qx) - (qx - px) * (ry - qy)
        if val2 == 0 { return 0 }
        return val2 > 0 ? 1 : 2
    }

    func onSegment(_ px: Int, _ py: Int, _ qx: Int, _ qy: Int, _ rx: Int, _ ry: Int) -> Bool {
        return qx <= max(px, rx) && qx >= min(px, rx) &&
               qy <= max(py, ry) && qy >= min(py, ry)
    }

    let o1 = orientation(x1, y1, x2, y2, x3, y3)
    let o2 = orientation(x1, y1, x2, y2, x4, y4)
    let o3 = orientation(x3, y3, x4, y4, x1, y1)
    let o4 = orientation(x3, y3, x4, y4, x2, y2)

    if o1 != o2 && o3 != o4 { return 1 }

    if o1 == 0 && onSegment(x1, y1, x3, y3, x2, y2) { return 1 }
    if o2 == 0 && onSegment(x1, y1, x4, y4, x2, y2) { return 1 }
    if o3 == 0 && onSegment(x3, y3, x1, y1, x4, y4) { return 1 }
    if o4 == 0 && onSegment(x3, y3, x2, y2, x4, y4) { return 1 }

    return 0
}
