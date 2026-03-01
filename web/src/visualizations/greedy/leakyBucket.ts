import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = { accepted: '#22c55e', overflow: '#ef4444', draining: '#3b82f6', bucket: '#eab308', empty: '#94a3b8' };

export class LeakyBucketVisualization implements AlgorithmVisualization {
  name = 'Leaky Bucket';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    // Use data as packet arrival sizes (varying rates)
    const packets = data.slice(0, Math.min(data.length, 12)).map(v => Math.max(0, Math.abs(v)));
    const n = packets.length;

    // Bucket parameters: capacity is ~60% of max possible fill, drain rate is median packet size
    const maxPacket = Math.max(...packets, 1);
    const bucketCapacity = Math.max(5, Math.floor(maxPacket * 1.5));
    const drainRate = Math.max(1, Math.floor(maxPacket / 3));

    let currentLevel = 0;

    // Step 0: Introduction
    this.steps.push({
      data: [...packets],
      highlights: packets.map((p, i) => ({ index: i, color: COLORS.bucket, label: `+${p}` })),
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Leaky Bucket: capacity=${bucketCapacity}, drain rate=${drainRate}/tick. ${n} packets arriving at varying rates.`,
    });

    const acceptedIndices: number[] = [];
    const overflowIndices: number[] = [];
    let totalAccepted = 0;
    let totalDropped = 0;

    for (let i = 0; i < n; i++) {
      const packetSize = packets[i];

      // First: drain the bucket (leak at constant rate)
      const drained = Math.min(currentLevel, drainRate);
      const levelAfterDrain = currentLevel - drained;

      if (drained > 0) {
        this.steps.push({
          data: [...packets],
          highlights: [
            { index: i, color: COLORS.bucket, label: `Pending +${packetSize}` },
            ...acceptedIndices.map(a => ({ index: a, color: COLORS.accepted })),
            ...overflowIndices.map(o => ({ index: o, color: COLORS.overflow })),
          ],
          comparisons: [],
          swaps: [],
          sorted: [...acceptedIndices],
          stepDescription: `Tick ${i + 1}: Drain ${drained} units. Bucket level: ${currentLevel} -> ${levelAfterDrain}`,
        });
      }

      currentLevel = levelAfterDrain;

      // Then: try to add the incoming packet
      const newLevel = currentLevel + packetSize;

      if (newLevel <= bucketCapacity) {
        // Packet accepted
        currentLevel = newLevel;
        totalAccepted += packetSize;
        acceptedIndices.push(i);

        this.steps.push({
          data: [...packets],
          highlights: [
            { index: i, color: COLORS.accepted, label: `+${packetSize} OK` },
            ...acceptedIndices.slice(0, -1).map(a => ({ index: a, color: COLORS.accepted })),
            ...overflowIndices.map(o => ({ index: o, color: COLORS.overflow })),
          ],
          comparisons: [],
          swaps: [],
          sorted: [...acceptedIndices],
          stepDescription: `Packet ${i} (size=${packetSize}) accepted. Bucket: ${currentLevel - packetSize} + ${packetSize} = ${currentLevel}/${bucketCapacity}`,
        });
      } else {
        // Packet dropped (overflow)
        totalDropped += packetSize;
        overflowIndices.push(i);

        this.steps.push({
          data: [...packets],
          highlights: [
            { index: i, color: COLORS.overflow, label: `+${packetSize} DROP` },
            ...acceptedIndices.map(a => ({ index: a, color: COLORS.accepted })),
            ...overflowIndices.slice(0, -1).map(o => ({ index: o, color: COLORS.overflow })),
          ],
          comparisons: [],
          swaps: [],
          sorted: [...acceptedIndices],
          stepDescription: `Packet ${i} (size=${packetSize}) DROPPED! Would exceed capacity: ${currentLevel} + ${packetSize} = ${newLevel} > ${bucketCapacity}`,
        });
      }
    }

    // Drain remaining
    if (currentLevel > 0) {
      const ticksToEmpty = Math.ceil(currentLevel / drainRate);
      this.steps.push({
        data: [...packets],
        highlights: [
          ...acceptedIndices.map(a => ({ index: a, color: COLORS.accepted })),
          ...overflowIndices.map(o => ({ index: o, color: COLORS.overflow })),
        ],
        comparisons: [],
        swaps: [],
        sorted: [...acceptedIndices],
        stepDescription: `Draining remaining ${currentLevel} units at rate ${drainRate}/tick (~${ticksToEmpty} more ticks to empty)`,
      });
    }

    // Final summary
    this.steps.push({
      data: [...packets],
      highlights: [
        ...acceptedIndices.map(a => ({ index: a, color: COLORS.accepted, label: 'OK' })),
        ...overflowIndices.map(o => ({ index: o, color: COLORS.overflow, label: 'Drop' })),
      ],
      comparisons: [],
      swaps: [],
      sorted: [...acceptedIndices],
      stepDescription: `Leaky Bucket complete. Accepted: ${acceptedIndices.length} packets (${totalAccepted} units). Dropped: ${overflowIndices.length} packets (${totalDropped} units). Capacity: ${bucketCapacity}, Drain: ${drainRate}/tick`,
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
