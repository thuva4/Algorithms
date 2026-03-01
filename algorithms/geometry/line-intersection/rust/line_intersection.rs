pub fn line_intersection(arr: &[i32]) -> i32 {
    let (x1, y1, x2, y2) = (arr[0], arr[1], arr[2], arr[3]);
    let (x3, y3, x4, y4) = (arr[4], arr[5], arr[6], arr[7]);

    fn orientation(px: i32, py: i32, qx: i32, qy: i32, rx: i32, ry: i32) -> i32 {
        let val = (qy - py) * (rx - qx) - (qx - px) * (ry - qy);
        if val == 0 { 0 } else if val > 0 { 1 } else { 2 }
    }

    fn on_segment(px: i32, py: i32, qx: i32, qy: i32, rx: i32, ry: i32) -> bool {
        qx <= px.max(rx) && qx >= px.min(rx) &&
        qy <= py.max(ry) && qy >= py.min(ry)
    }

    let o1 = orientation(x1, y1, x2, y2, x3, y3);
    let o2 = orientation(x1, y1, x2, y2, x4, y4);
    let o3 = orientation(x3, y3, x4, y4, x1, y1);
    let o4 = orientation(x3, y3, x4, y4, x2, y2);

    if o1 != o2 && o3 != o4 { return 1; }

    if o1 == 0 && on_segment(x1, y1, x3, y3, x2, y2) { return 1; }
    if o2 == 0 && on_segment(x1, y1, x4, y4, x2, y2) { return 1; }
    if o3 == 0 && on_segment(x3, y3, x1, y1, x4, y4) { return 1; }
    if o4 == 0 && on_segment(x3, y3, x2, y2, x4, y4) { return 1; }

    0
}
