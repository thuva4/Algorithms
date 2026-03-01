/**
 * Hungarian Algorithm - Solve the assignment problem in O(n^3).
 *
 * @param cost - n x n cost matrix
 * @returns [assignment, totalCost] where assignment[i] is the job for worker i
 */
export function hungarianAlgorithm(cost: number[][]): [number[], number] {
    const n = cost.length;
    const INF = Number.MAX_SAFE_INTEGER;

    const u = new Array(n + 1).fill(0);
    const v = new Array(n + 1).fill(0);
    const matchJob = new Array(n + 1).fill(0);

    for (let i = 1; i <= n; i++) {
        matchJob[0] = i;
        let j0 = 0;
        const dist = new Array(n + 1).fill(INF);
        const used = new Array(n + 1).fill(false);
        const prevJob = new Array(n + 1).fill(0);

        while (true) {
            used[j0] = true;
            const w = matchJob[j0];
            let delta = INF;
            let j1 = -1;

            for (let j = 1; j <= n; j++) {
                if (!used[j]) {
                    const cur = cost[w - 1][j - 1] - u[w] - v[j];
                    if (cur < dist[j]) {
                        dist[j] = cur;
                        prevJob[j] = j0;
                    }
                    if (dist[j] < delta) {
                        delta = dist[j];
                        j1 = j;
                    }
                }
            }

            for (let j = 0; j <= n; j++) {
                if (used[j]) {
                    u[matchJob[j]] += delta;
                    v[j] -= delta;
                } else {
                    dist[j] -= delta;
                }
            }

            j0 = j1;
            if (matchJob[j0] === 0) break;
        }

        while (j0 !== 0) {
            matchJob[j0] = matchJob[prevJob[j0]];
            j0 = prevJob[j0];
        }
    }

    const assignment: number[] = new Array(n);
    for (let j = 1; j <= n; j++) {
        assignment[matchJob[j] - 1] = j - 1;
    }

    let totalCost = 0;
    for (let i = 0; i < n; i++) {
        totalCost += cost[i][assignment[i]];
    }

    return [assignment, totalCost];
}

export function hungarian(costMatrix: number[][]): { assignment: number[]; total_cost: number } {
  const [assignment, totalCost] = hungarianAlgorithm(costMatrix);
  return { assignment, total_cost: totalCost };
}
