import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  computing: '#3b82f6',
  anchor: '#eab308',
  adjustment: '#ef4444',
  dayOfWeek: '#22c55e',
  result: '#a855f7',
};

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export class DoomsdayVisualization implements AlgorithmVisualization {
  name = 'Doomsday Algorithm';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    // Determine a date from data input
    const year = Math.max(1900, Math.min(2100, Math.abs(data[0] || 2024)));
    const month = Math.max(1, Math.min(12, Math.abs(data[1] || 3) % 12 + 1));
    const maxDay = this.daysInMonth(month, year);
    const day = Math.max(1, Math.min(maxDay, Math.abs(data[2] || 15) % maxDay + 1));

    // data: [year, month, day, centuryAnchor, yearAnchor, doomsdayForMonth, result]
    const makeData = (ca: number, ya: number, dm: number, res: number): number[] =>
      [year, month, day, ca, ya, dm, res];

    this.steps.push({
      data: makeData(0, 0, 0, -1),
      highlights: [
        { index: 0, color: COLORS.computing, label: `Year=${year}` },
        { index: 1, color: COLORS.computing, label: `Month=${month}` },
        { index: 2, color: COLORS.computing, label: `Day=${day}` },
      ],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Doomsday algorithm: finding the day of the week for ${month}/${day}/${year}`,
    });

    // Step 1: Century anchor
    // Anchor days repeat every 400 years: 1800=Friday(5), 1900=Wednesday(3), 2000=Tuesday(2), 2100=Sunday(0)
    const century = Math.floor(year / 100);
    const centuryAnchors: Record<number, number> = { 18: 5, 19: 3, 20: 2, 21: 0 };
    const centuryAnchor = centuryAnchors[century] !== undefined
      ? centuryAnchors[century]
      : ((5 * (century % 4) + 2) % 7); // general formula

    this.steps.push({
      data: makeData(centuryAnchor, 0, 0, -1),
      highlights: [
        { index: 3, color: COLORS.anchor, label: `Century anchor=${DAY_NAMES[centuryAnchor]}` },
      ],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Step 1: Century ${century}00 has anchor day = ${DAY_NAMES[centuryAnchor]} (${centuryAnchor})`,
    });

    // Step 2: Year within century
    const yy = year % 100;

    this.steps.push({
      data: makeData(centuryAnchor, 0, 0, -1),
      highlights: [
        { index: 0, color: COLORS.computing, label: `yy=${yy}` },
      ],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Step 2: Year within century = ${yy}`,
    });

    // Step 3: Compute doomsday for the year using the "odd+11" method
    let a = yy;
    if (a % 2 !== 0) a += 11;
    this.steps.push({
      data: makeData(centuryAnchor, 0, 0, -1),
      highlights: [
        { index: 0, color: COLORS.adjustment, label: `a=${a}` },
      ],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Step 3a: If odd, add 11: ${yy} -> ${a}`,
    });

    a = a / 2;
    this.steps.push({
      data: makeData(centuryAnchor, 0, 0, -1),
      highlights: [
        { index: 0, color: COLORS.adjustment, label: `a=${a}` },
      ],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Step 3b: Divide by 2: ${a * 2} / 2 = ${a}`,
    });

    if (a % 2 !== 0) a += 11;
    this.steps.push({
      data: makeData(centuryAnchor, 0, 0, -1),
      highlights: [
        { index: 0, color: COLORS.adjustment, label: `a=${a}` },
      ],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Step 3c: If odd, add 11: -> ${a}`,
    });

    const rem = a % 7;
    const yearDoomsday = (centuryAnchor + 7 - rem) % 7;

    this.steps.push({
      data: makeData(centuryAnchor, yearDoomsday, 0, -1),
      highlights: [
        { index: 4, color: COLORS.dayOfWeek, label: `Doomsday=${DAY_NAMES[yearDoomsday]}` },
      ],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Step 3d: ${a} mod 7 = ${rem}. Doomsday for ${year} = (${centuryAnchor} + 7 - ${rem}) mod 7 = ${yearDoomsday} (${DAY_NAMES[yearDoomsday]})`,
    });

    // Step 4: Find the doomsday date for the target month
    const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    // Doomsday dates for each month (1-indexed)
    // Jan: 3 (4 in leap), Feb: 28 (29 in leap), Mar: 7, Apr: 4, May: 9, Jun: 6,
    // Jul: 11, Aug: 8, Sep: 5, Oct: 10, Nov: 7, Dec: 12
    const doomsdayDates = [
      0, // placeholder
      isLeap ? 4 : 3,  // Jan
      isLeap ? 29 : 28, // Feb
      7,  // Mar
      4,  // Apr
      9,  // May
      6,  // Jun
      11, // Jul
      8,  // Aug
      5,  // Sep
      10, // Oct
      7,  // Nov
      12, // Dec
    ];

    const doomDate = doomsdayDates[month];

    this.steps.push({
      data: makeData(centuryAnchor, yearDoomsday, doomDate, -1),
      highlights: [
        { index: 5, color: COLORS.anchor, label: `Doom date=${month}/${doomDate}` },
      ],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Step 4: In month ${month}, the doomsday date is the ${doomDate}th (${DAY_NAMES[yearDoomsday]})`,
    });

    // Step 5: Calculate difference and find day of week
    const diff = day - doomDate;
    const dayOfWeek = ((yearDoomsday + diff) % 7 + 7) % 7;

    this.steps.push({
      data: makeData(centuryAnchor, yearDoomsday, doomDate, dayOfWeek),
      highlights: [
        { index: 6, color: COLORS.adjustment, label: `diff=${diff}` },
      ],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Step 5: Day ${day} - doomsday ${doomDate} = ${diff} days. (${yearDoomsday} + ${diff}) mod 7 = ${dayOfWeek}`,
    });

    // Final result
    this.steps.push({
      data: makeData(centuryAnchor, yearDoomsday, doomDate, dayOfWeek),
      highlights: [
        { index: 6, color: COLORS.result, label: DAY_NAMES[dayOfWeek] },
      ],
      comparisons: [],
      swaps: [],
      sorted: [6],
      stepDescription: `Result: ${month}/${day}/${year} is a ${DAY_NAMES[dayOfWeek]}`,
    });

    return this.steps[0];
  }

  private daysInMonth(month: number, year: number): number {
    const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    const days = [0, 31, isLeap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return days[month];
  }

  step(): VisualizationState | null {
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
