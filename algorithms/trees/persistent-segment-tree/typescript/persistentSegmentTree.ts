export function persistentSegmentTree(
  n: number,
  array: number[],
  operations: Array<[number, number, number, number]>,
): number[] {
  const versions: number[][] = [array.slice(0, n)];
  const results: number[] = [];

  for (const [type, version, a, b] of operations) {
    if (type === 1) {
      const next = versions[version].slice();
      next[a] = b;
      versions.push(next);
    } else if (type === 2) {
      let sum = 0;
      for (let i = a; i <= b; i += 1) {
        sum += versions[version][i];
      }
      results.push(sum);
    }
  }

  return results;
}
