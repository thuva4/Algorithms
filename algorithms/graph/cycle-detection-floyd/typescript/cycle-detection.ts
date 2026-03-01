export function detectCycle(arr: number[]): number {
  if (arr.length === 0) return -1;
  const size = arr.length;

  let tortoise = 0;
  let hare = 0;

  while (true) {
    if (tortoise < 0 || tortoise >= size || arr[tortoise] < 0 || arr[tortoise] >= size) {
      return -1;
    }
    tortoise = arr[tortoise];

    if (hare < 0 || hare >= size || arr[hare] < 0 || arr[hare] >= size) {
      return -1;
    }
    hare = arr[hare];
    if (hare < 0 || hare >= size || arr[hare] < 0 || arr[hare] >= size) {
      return -1;
    }
    hare = arr[hare];

    if (tortoise === hare) {
      break;
    }
  }

  tortoise = 0;
  while (tortoise !== hare) {
    tortoise = arr[tortoise];
    hare = arr[hare];
  }

  return tortoise;
}
