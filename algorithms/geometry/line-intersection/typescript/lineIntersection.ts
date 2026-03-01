export function lineIntersection(arr: number[]): number {
    const [x1, y1, x2, y2, x3, y3, x4, y4] = arr;

    function orientation(px: number, py: number, qx: number, qy: number, rx: number, ry: number): number {
        const val = (qy - py) * (rx - qx) - (qx - px) * (ry - qy);
        if (val === 0) return 0;
        return val > 0 ? 1 : 2;
    }

    function onSegment(px: number, py: number, qx: number, qy: number, rx: number, ry: number): boolean {
        return qx <= Math.max(px, rx) && qx >= Math.min(px, rx) &&
               qy <= Math.max(py, ry) && qy >= Math.min(py, ry);
    }

    const o1 = orientation(x1, y1, x2, y2, x3, y3);
    const o2 = orientation(x1, y1, x2, y2, x4, y4);
    const o3 = orientation(x3, y3, x4, y4, x1, y1);
    const o4 = orientation(x3, y3, x4, y4, x2, y2);

    if (o1 !== o2 && o3 !== o4) return 1;

    if (o1 === 0 && onSegment(x1, y1, x3, y3, x2, y2)) return 1;
    if (o2 === 0 && onSegment(x1, y1, x4, y4, x2, y2)) return 1;
    if (o3 === 0 && onSegment(x3, y3, x1, y1, x4, y4)) return 1;
    if (o4 === 0 && onSegment(x3, y3, x2, y2, x4, y4)) return 1;

    return 0;
}
