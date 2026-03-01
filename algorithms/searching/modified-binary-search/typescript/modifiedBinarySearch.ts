export function modifiedBinarySearch(arr: number[], target: number): number {
    let low = 0;
    let high = arr.length - 1;
    let result = -1;

    while (low <= high) {
        const mid = low + Math.floor((high - low) / 2);
        if (arr[mid] === target) {
            result = mid;
            high = mid - 1;
        } else if (arr[mid] < target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }

    return result;
}

const arr = [1, 3, 5, 7, 9, 11];
const target = 7;
const res = modifiedBinarySearch(arr, target);
console.log(`Index of ${target} is ${res}`);
