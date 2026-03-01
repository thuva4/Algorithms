import type { DPVisualizationEngine, DPVisualizationState, DPCell } from '../types';

const COLORS = {
  empty: '#f3f4f6',
  computing: '#fbbf24',
  computed: '#60a5fa',
  optimal: '#34d399',
  dependency: '#f87171',
};

export class TravellingSalesmanVisualization implements DPVisualizationEngine {
  name = 'Travelling Salesman Problem';
  visualizationType = 'dp' as const;

  private steps: DPVisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(input: { values?: number[]; text1?: string; text2?: string; target?: number; weights?: number[] }): DPVisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    // Build distance matrix from input values
    const vals = input.values ?? [1, 5, 8, 9, 10, 17, 17, 20];
    const n = Math.min(input.target ?? 4, 4); // cap at 4 cities for manageable visualization
    const INF = 99999;

    const dist: number[][] = [];
    for (let i = 0; i < n; i++) {
      const row: number[] = [];
      for (let j = 0; j < n; j++) {
        if (i === j) row.push(0);
        else row.push(vals[(i * n + j) % vals.length] || 1);
      }
      dist.push(row);
    }

    const total = 1 << n;
    const maskStr = (mask: number): string => mask.toString(2).padStart(n, '0');

    // dp[mask][i] = min cost to visit cities in mask, ending at city i, starting from city 0
    const dp: number[][] = Array.from({ length: total }, () => new Array(n).fill(INF));
    dp[1][0] = 0; // start at city 0

    const rowLabels = Array.from({ length: total }, (_, mask) => maskStr(mask));
    const colLabels = Array.from({ length: n }, (_, i) => `C${i}`);
    const cellColors: string[][] = Array.from({ length: total }, () => new Array(n).fill(COLORS.empty));

    const displayVal = (v: number) => v >= INF ? '\u221E' : v;

    const makeTable = (): DPCell[][] =>
      dp.map((row, mask) => row.map((v, j) => ({
        value: cellColors[mask][j] === COLORS.empty ? '' : displayVal(v),
        color: cellColors[mask][j],
      })));

    // Show distance matrix first
    this.steps.push({
      table: dist.map((row) => row.map((v) => ({
        value: v,
        color: COLORS.computed,
      }))),
      rowLabels: Array.from({ length: n }, (_, i) => `C${i}`),
      colLabels: Array.from({ length: n }, (_, i) => `C${i}`),
      currentCell: null,
      arrows: [],
      stepDescription: `TSP with ${n} cities. Distance matrix shown. Find minimum cost Hamiltonian cycle.`,
    });

    cellColors[1][0] = COLORS.computed;
    this.steps.push({
      table: makeTable(),
      rowLabels,
      colLabels,
      currentCell: [1, 0],
      arrows: [],
      stepDescription: `dp[${maskStr(1)}][0] = 0. Start at city 0.`,
    });

    // Fill DP table
    for (let mask = 1; mask < total; mask++) {
      for (let u = 0; u < n; u++) {
        if (!(mask & (1 << u))) continue;
        if (dp[mask][u] >= INF) continue;

        for (let v = 0; v < n; v++) {
          if (mask & (1 << v)) continue;
          const newMask = mask | (1 << v);
          const newCost = dp[mask][u] + dist[u][v];

          if (newCost < dp[newMask][v]) {
            const depColors = cellColors.map(row => [...row]);
            depColors[newMask][v] = COLORS.computing;
            depColors[mask][u] = COLORS.dependency;

            dp[newMask][v] = newCost;

            this.steps.push({
              table: dp.map((row, mi) => row.map((val, ci) => ({
                value: depColors[mi][ci] === COLORS.empty ? '' : displayVal(val),
                color: depColors[mi][ci],
              }))),
              rowLabels,
              colLabels,
              currentCell: [newMask, v],
              arrows: [{ from: [newMask, v], to: [mask, u] }],
              stepDescription: `From city ${u} (mask=${maskStr(mask)}) to city ${v}: dp[${maskStr(newMask)}][${v}] = ${dp[mask][u]} + ${dist[u][v]} = ${newCost}.`,
            });

            cellColors[newMask][v] = COLORS.computed;
          }
        }
      }
    }

    // Find minimum tour cost (return to city 0)
    const fullMask = total - 1;
    let minTour = INF;
    let lastCity = 0;
    for (let i = 0; i < n; i++) {
      if (dp[fullMask][i] + dist[i][0] < minTour) {
        minTour = dp[fullMask][i] + dist[i][0];
        lastCity = i;
      }
    }

    const finalColors = cellColors.map(row => [...row]);
    finalColors[fullMask][lastCity] = COLORS.optimal;

    this.steps.push({
      table: dp.map((row, mi) => row.map((v, ci) => ({
        value: displayVal(v),
        color: finalColors[mi][ci],
      }))),
      rowLabels,
      colLabels,
      currentCell: [fullMask, lastCity],
      arrows: [],
      stepDescription: `Minimum TSP tour cost = ${displayVal(minTour)}. Return from city ${lastCity} to city 0 (cost ${dist[lastCity][0]}).`,
    });

    return this.steps[0];
  }

  step(): DPVisualizationState | null {
    this.currentStepIndex++;
    if (this.currentStepIndex >= this.steps.length) {
      this.currentStepIndex = this.steps.length;
      return null;
    }
    return this.steps[this.currentStepIndex];
  }

  reset(): void {
    this.currentStepIndex = -1;
  }

  getStepCount(): number {
    return this.steps.length;
  }

  getCurrentStep(): number {
    return this.currentStepIndex;
  }
}
