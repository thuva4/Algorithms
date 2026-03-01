import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = { scheduled: '#22c55e', trying: '#eab308', failed: '#ef4444', slot: '#3b82f6', profit: '#8b5cf6' };

export class JobSchedulingVisualization implements AlgorithmVisualization {
  name = 'Job Scheduling with Deadlines';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const n = Math.min(data.length, 10);
    // Generate jobs: profit from data values, deadline derived from index
    const jobs: { profit: number; deadline: number; id: number }[] = data.slice(0, n).map((v, i) => ({
      profit: Math.max(1, Math.abs(v)),
      deadline: Math.max(1, Math.min(n, Math.floor(Math.random() * n) + 1)),
      id: i,
    }));

    // Sort by profit descending (greedy strategy)
    jobs.sort((a, b) => b.profit - a.profit);

    const maxDeadline = Math.max(...jobs.map(j => j.deadline));
    const profits = jobs.map(j => j.profit);

    // Step 0: Show all jobs sorted by profit
    this.steps.push({
      data: profits,
      highlights: jobs.map((j, i) => ({
        index: i,
        color: COLORS.profit,
        label: `P=${j.profit} D=${j.deadline}`,
      })),
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Job Scheduling: ${n} jobs sorted by profit (descending). Max deadline: ${maxDeadline}. Schedule for max profit.`,
    });

    // Track slot assignments: slots[1..maxDeadline]
    const slots: (number | null)[] = new Array(maxDeadline + 1).fill(null);
    const scheduledIndices: number[] = [];
    let totalProfit = 0;

    for (let i = 0; i < jobs.length; i++) {
      const job = jobs[i];

      // Show trying to schedule this job
      this.steps.push({
        data: profits,
        highlights: [
          { index: i, color: COLORS.trying, label: `P=${job.profit} D=${job.deadline}` },
          ...scheduledIndices.map(s => ({ index: s, color: COLORS.scheduled })),
        ],
        comparisons: [],
        swaps: [],
        sorted: [...scheduledIndices],
        stepDescription: `Try job ${job.id} (profit=${job.profit}, deadline=${job.deadline}). Search for latest available slot <= ${job.deadline}`,
      });

      // Find latest available slot before or at deadline
      let placed = false;
      const searchLimit = Math.min(job.deadline, maxDeadline);

      for (let t = searchLimit; t >= 1; t--) {
        if (slots[t] === null) {
          // Schedule the job
          slots[t] = job.id;
          scheduledIndices.push(i);
          totalProfit += job.profit;
          placed = true;

          this.steps.push({
            data: profits,
            highlights: [
              { index: i, color: COLORS.scheduled, label: `Slot ${t}` },
              ...scheduledIndices.slice(0, -1).map(s => ({ index: s, color: COLORS.scheduled })),
            ],
            comparisons: [],
            swaps: [],
            sorted: [...scheduledIndices],
            stepDescription: `Scheduled job ${job.id} in slot ${t} (profit +${job.profit}). Total profit: ${totalProfit}`,
          });
          break;
        }
      }

      if (!placed) {
        this.steps.push({
          data: profits,
          highlights: [
            { index: i, color: COLORS.failed, label: 'No slot' },
            ...scheduledIndices.map(s => ({ index: s, color: COLORS.scheduled })),
          ],
          comparisons: [],
          swaps: [],
          sorted: [...scheduledIndices],
          stepDescription: `Cannot schedule job ${job.id} (profit=${job.profit}). All slots up to deadline ${job.deadline} are occupied.`,
        });
      }
    }

    // Build slot summary
    const slotSummary = slots
      .map((jobId, t) => (jobId !== null && t > 0) ? `Slot${t}=J${jobId}` : null)
      .filter(Boolean)
      .join(', ');

    // Final result
    this.steps.push({
      data: profits,
      highlights: scheduledIndices.map(s => ({
        index: s,
        color: COLORS.scheduled,
        label: `J${jobs[s].id}`,
      })),
      comparisons: [],
      swaps: [],
      sorted: [...scheduledIndices],
      stepDescription: `Scheduling complete. ${scheduledIndices.length}/${n} jobs scheduled. Total profit: ${totalProfit}. [${slotSummary}]`,
    });

    return this.steps[0];
  }

  step(): VisualizationState | null {
    this.currentStepIndex++;
    return this.currentStepIndex < this.steps.length ? this.steps[this.currentStepIndex] : null;
  }
  reset(): void { this.currentStepIndex = -1; }
  getStepCount(): number { return this.steps.length; }
  getCurrentStep(): number { return this.currentStepIndex; }
}
