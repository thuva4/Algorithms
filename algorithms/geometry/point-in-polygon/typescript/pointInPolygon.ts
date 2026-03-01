export function pointInPolygon(arr: number[]): number {
    const px = arr[0], py = arr[1];
    const n = arr[2];

    let inside = false;
    let j = n - 1;
    for (let i = 0; i < n; i++) {
        const xi = arr[3 + 2 * i], yi = arr[3 + 2 * i + 1];
        const xj = arr[3 + 2 * j], yj = arr[3 + 2 * j + 1];

        if ((yi > py) !== (yj > py) &&
            px < (xj - xi) * (py - yi) / (yj - yi) + xi) {
            inside = !inside;
        }
        j = i;
    }

    return inside ? 1 : 0;
}
