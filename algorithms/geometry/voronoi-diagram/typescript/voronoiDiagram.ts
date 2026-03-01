export function voronoiDiagram(arr: number[]): number {
    const n = arr[0];
    if (n < 3) return 0;

    const px: number[] = [], py: number[] = [];
    for (let i = 0; i < n; i++) {
        px.push(arr[1 + 2 * i]);
        py.push(arr[1 + 2 * i + 1]);
    }

    const EPS = 1e-9;
    const vertices = new Set<string>();

    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            for (let k = j + 1; k < n; k++) {
                const ax = px[i], ay = py[i];
                const bx = px[j], by = py[j];
                const cx = px[k], cy = py[k];

                const d = 2.0 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by));
                if (Math.abs(d) < EPS) continue;

                const ux = ((ax*ax + ay*ay) * (by - cy) +
                            (bx*bx + by*by) * (cy - ay) +
                            (cx*cx + cy*cy) * (ay - by)) / d;
                const uy = ((ax*ax + ay*ay) * (cx - bx) +
                            (bx*bx + by*by) * (ax - cx) +
                            (cx*cx + cy*cy) * (bx - ax)) / d;

                const rSq = (ux - ax) * (ux - ax) + (uy - ay) * (uy - ay);

                let valid = true;
                for (let m = 0; m < n; m++) {
                    if (m === i || m === j || m === k) continue;
                    const distSq = (ux - px[m]) * (ux - px[m]) + (uy - py[m]) * (uy - py[m]);
                    if (distSq < rSq - EPS) {
                        valid = false;
                        break;
                    }
                }

                if (valid) {
                    const rx = Math.round(ux * 1000000);
                    const ry = Math.round(uy * 1000000);
                    vertices.add(`${rx},${ry}`);
                }
            }
        }
    }

    return vertices.size;
}
