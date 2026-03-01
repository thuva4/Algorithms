export function permutations(values) {
  if (values.length === 0) {
    return [[]];
  }

  if (values.length === 1) {
    return [values.slice()];
  }

  const results = [];
  for (let i = 0; i < values.length; i += 1) {
    const current = values[i];
    const rest = values.slice(0, i).concat(values.slice(i + 1));

    for (const permutation of permutations(rest)) {
      results.push([current, ...permutation]);
    }
  }

  return results;
}
