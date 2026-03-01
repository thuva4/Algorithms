export function ropeDataStructure(data: number[]): number {
    const n1 = data[0];
    const arr1 = data.slice(1, 1 + n1);
    const pos = 1 + n1;
    const n2 = data[pos];
    const arr2 = data.slice(pos + 1, pos + 1 + n2);
    const queryIndex = data[pos + 1 + n2];

    // Rope: concatenate arr1 and arr2 then index
    const combined = [...arr1, ...arr2];
    return combined[queryIndex];
}

console.log(ropeDataStructure([3, 1, 2, 3, 2, 4, 5, 0]));
console.log(ropeDataStructure([3, 1, 2, 3, 2, 4, 5, 4]));
console.log(ropeDataStructure([3, 1, 2, 3, 2, 4, 5, 3]));
