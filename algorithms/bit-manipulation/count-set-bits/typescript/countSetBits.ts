export function countSetBits(arr: number[]): number {
    let total = 0;
    for (let num of arr) {
        while (num !== 0) {
            total++;
            num &= (num - 1);
        }
    }
    return total;
}
