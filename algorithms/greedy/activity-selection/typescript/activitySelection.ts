export function activitySelection(arr: number[]): number {
    const n = Math.floor(arr.length / 2);
    if (n === 0) {
        return 0;
    }

    const activities: [number, number][] = [];
    for (let i = 0; i < n; i++) {
        activities.push([arr[2 * i], arr[2 * i + 1]]);
    }

    activities.sort((a, b) => a[1] - b[1]);

    let count = 1;
    let lastFinish = activities[0][1];

    for (let i = 1; i < n; i++) {
        if (activities[i][0] >= lastFinish) {
            count++;
            lastFinish = activities[i][1];
        }
    }

    return count;
}
